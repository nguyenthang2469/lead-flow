import { AppLogger } from '@/common/logger/logger.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenPayload } from '../auth/token-payload.interface';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly logger: AppLogger) {}

  // afterInit(server: Server) {
  //   server.use((socket: Socket, next) => {
  //     void (async () => {
  //       try {
  //         const cookieString = socket.handshake.headers.cookie;
  //         if (!cookieString) {
  //           return next(new Error('Authentication Error: Missing cookies'));
  //         }

  //         if (!token) {
  //           return next(new Error('Authentication Error: Token not found'));
  //         }

  //         const payload = await this.jwt.verifyAsync<TokenPayload>(token);
  //         (socket.data as { user: TokenPayload }).user = payload;
  //         next();
  //       } catch {
  //         next(new Error('Authentication Error: Invalid token'));
  //       }
  //     })();
  //   });
  // }

  handleConnection(client: Socket) {
    const user = (client.data as { user?: TokenPayload }).user;
    this.logger.log(
      `🟢 Client connected: ${client.id} - User ID: ${user?.sub}`
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔴 Client disconnected: ${client.id}`);
  }

  emitNewLead(lead: any) {
    this.server.emit('lead.created', lead);
  }

  emitLeadUpdated(lead: any) {
    this.server.emit('lead.updated', lead);
  }
}
