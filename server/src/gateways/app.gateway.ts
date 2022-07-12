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
  transports: ['polling'],
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
    const streamId = data.streamId;
    console.log('INIT OBSERVER');
    client.emit('initObserverRes', { msg: 'init' });
    const observer = spawn(
      'python',
      ['../observer/observer.py', `${streamId}`],
      { stdio: 'inherit' },
    );
    this.observer = observer

    observer.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    observer.on('exit', (code) => {
      console.log(`OBSERVER EXIT with CODE ${code}`);
    });
  }

  @SubscribeMessage('aliveObserver')
  aliveObserver(
  ): void {
    console.log('aliveObserver');
    this.server.emit('aliveObserverRes');
  }

  @SubscribeMessage('stopObserver')
  stopObserver(): void {
    if (this.observer) {
      this.observer.kill('SIGINT')
      this.observer = undefined;
      this.server.emit('stopObserverRes');
    }
  }

  @SubscribeMessage('changeChar')
  changeChar(@MessageBody() data: { char: string }): void {
    console.log(data);
    this.server.emit('setChar', { char: data.char });
  }

  @SubscribeMessage('changeType')
  changeType(@MessageBody() data: { type: string }): void {
    console.log(data);
    this.server.emit('setType', { type: data.type });
  }

  afterInit(server: Server) {
    console.log('INIT SOCKET.IO');
  }

  handleDisconnect(client: Socket) {
    console.log(`CLIENT DISCONNECTED: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`CLIENT CONNECTED: ${client.id}`);
  }
}
