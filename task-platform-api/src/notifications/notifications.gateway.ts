import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    // read userId from query (simple dev approach)
    const userId = (socket.handshake.query.userId as string) || '';
    if (userId) socket.join(`user:${userId}`); // user-specific room
  }

  notifyToUser(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
