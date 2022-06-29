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

@WebSocketGateway(80, {
  transports: ['websocket'],
  namespace: 'mapleinfo',
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}

  @SubscribeMessage('hello')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    console.log(client)
    return data;
  }

  afterInit(server: Server) {
    console.log('INIT SOCKET.IO')
  }

  handleDisconnect(client: Socket) {
    console.log(`CLIENT DISCONNECTED: ${client.id}`)
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`CLIENT CONNECTED: ${client.id}`)
  }
}
