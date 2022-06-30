import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
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

  @SubscribeMessage('changeChar')
  handleEvent(
    @MessageBody() data: { char: string },
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(data);
    client.emit('setChar', { char: data.char });
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
