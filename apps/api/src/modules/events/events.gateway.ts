import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenPayload } from '../auth/token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';
import { config } from 'dotenv';
import { AUTH_AT_COOKIE_NAME } from '@/common/constants/auth.constant';
import type { Lead } from '@/generated/prisma/client';
config();
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: Server) {
    server.use((socket: Socket, next) => {
      void (async () => {
        try {
          const cookieString = socket.handshake.headers.cookie;
          if (!cookieString) {
            return next(new Error('Authentication Error: Missing cookies'));
          }

          const cookies = cookie.parse(cookieString);
          const token = cookies[AUTH_AT_COOKIE_NAME];
          if (!token) {
            return next(new Error('Authentication Error: Token not found'));
          }

          const payload =
            await this.jwtService.verifyAsync<TokenPayload>(token);
          (socket.data as { user: TokenPayload }).user = payload;
          next();
        } catch {
          next(new Error('Authentication Error: Invalid token'));
        }
      })();
    });
  }

  handleConnection(client: Socket) {
    const user = (client.data as { user?: TokenPayload }).user;
    this.logger.log(
      `🟢 Client connected: ${client.id} - User ID: ${user?.sub}`
    );
  }

  handleDisconnect(client: Socket) {
    const user = (client.data as { user?: TokenPayload }).user;
    this.logger.log(
      `🔴 Client disconnected: ${client.id} - User ID: ${user?.sub}`
    );
  }

  emitNewLead(lead: Lead) {
    this.server.emit('lead.created', lead);
  }

  emitLeadUpdated(lead: Lead) {
    this.server.emit('lead.updated', lead);
  }

  emitLeadDeleted(leadId: string) {
    this.server.emit('lead.deleted', leadId);
  }
}
