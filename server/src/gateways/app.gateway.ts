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

  @SubscribeMessage('healthCheck')
  healthCheck(
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('HEALTH CHECK')
    client.emit('healthCheckRes', { msg: 'ok' });
  }

  @SubscribeMessage('changeChar')
  changeChar(
    @MessageBody() data: { char: string },
  ): void {
    console.log(data);
    this.server.emit('setChar', { char: data.char })
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
