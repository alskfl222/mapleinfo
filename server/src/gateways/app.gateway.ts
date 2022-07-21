import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChildProcess, spawn } from 'child_process';

@WebSocketGateway(4004, {
  // transports: ['polling'],
  namespace: 'mapleinfo',
  cors: true,
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}

  @WebSocketServer()
  server: Server;

  observer: ChildProcess | undefined;

  viewState: { char: string; type: string } = {
    char: '네리에리네',
    type: 'stat',
  };

  @SubscribeMessage('healthCheck')
  healthCheck(@ConnectedSocket() client: Socket): void {
    console.log('HEALTH CHECK');
    client.emit('healthCheckRes', { msg: 'ok' });
  }

  @SubscribeMessage('initObserver')
  initObserver(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { streamId: string },
  ): void {
    if (!this.observer) {
      const streamId = data.streamId;
      console.log('INIT OBSERVER');
      client.emit('initObserverRes', { msg: 'init' });
      const observer = spawn('python3', [
        '../observer/observer.py',
        `${streamId}`,
      ]);
      this.observer = observer;

      observer.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      observer.on('exit', (code) => {
        console.log(`OBSERVER EXIT with CODE ${code}`);
        this.observer = undefined;
        this.server.emit('stopObserverRes');
      });
    } else {
    }
  }

  @SubscribeMessage('aliveObserver')
  aliveObserver(): void {
    this.server.emit('aliveObserverRes');
  }

  @SubscribeMessage('stopObserver')
  stopObserver(): void {
    if (this.observer) {
      this.observer.kill('SIGINT');
      this.observer = undefined;
      this.server.emit('stopObserverRes');
    }
  }

  @SubscribeMessage('getViewState')
  getViewState(): void {
    this.server.emit('setChar', this.viewState.char);
    this.server.emit('setType', this.viewState.type);
  }

  @SubscribeMessage('changeView')
  changeView(@MessageBody() data: { char: string; type: string }): void {
    const { char, type } = data;
    if (
      [
        '네리에리네',
        '프레아루쥬',
        '날림v나로',
        '날림v카이저',
        '챠르마',
        '펭귄에코티슈',
        '날림v네비',
        '날림v숍2',
        '날림v호영',
        '날림v아델',
        '날림v쌍칼',
        '날림v주먹',
        '날림v빙뢰',
        '날림v아크',
        '날림v카인',
        '날림v히어로2',
        '날림v나린',
        '미르나르미',
        '날림v세탁',
      ].includes(char)
    ) {
      this.viewState = { char, type };
      console.log(this.viewState);
      this.server.emit('setView', this.viewState);
    } else {
      console.log('NOT MY CHARS');
    }
  }

  afterInit(server: Server) {
    console.log('INIT SOCKET.IO');
  }

  handleDisconnect(client: Socket) {
    console.log(`CLIENT DISCONNECTED: ${client.id}`);
  }

  handleConnection(client: Socket) {
    console.log(`CLIENT CONNECTED: ${client.id}`);
  }
}
