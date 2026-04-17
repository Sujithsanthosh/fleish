import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId
  private vendorSockets = new Map<string, string>(); // vendorId -> socketId
  private orderRooms = new Map<string, Set<string>>(); // orderId -> Set<socketId>

  handleConnection(client: Socket) {
    // Support both userId and riderId for delivery riders
    const userId = (client.handshake.query.userId || client.handshake.query.riderId) as string;
    const role = client.handshake.query.role as string;

    if (userId) {
      if (role === 'vendor') {
        this.vendorSockets.set(userId, client.id);
      } else {
        // customer, rider, or any other role
        this.userSockets.set(userId, client.id);
      }
      console.log(`Socket connected: ${userId} (${role}) -> ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [id, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) { this.userSockets.delete(id); break; }
    }
    for (const [id, socketId] of this.vendorSockets.entries()) {
      if (socketId === client.id) { this.vendorSockets.delete(id); break; }
    }
    for (const [orderId, socketIds] of this.orderRooms.entries()) {
      socketIds.delete(client.id);
      if (socketIds.size === 0) this.orderRooms.delete(orderId);
    }
  }

  notifyUser(userId: string, event: string, data: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) this.server.to(socketId).emit(event, data);
  }

  notifyVendor(vendorId: string, event: string, data: any) {
    const socketId = this.vendorSockets.get(vendorId);
    if (socketId) this.server.to(socketId).emit(event, data);
  }

  @SubscribeMessage('join_order')
  handleJoinOrder(client: Socket, payload: { orderId: string }) {
    const { orderId } = payload;
    client.join(`order_${orderId}`);
    if (!this.orderRooms.has(orderId)) this.orderRooms.set(orderId, new Set());
    this.orderRooms.get(orderId)!.add(client.id);
    return { event: 'joined', room: `order_${orderId}` };
  }

  @SubscribeMessage('leave_order')
  handleLeaveOrder(client: Socket, payload: { orderId: string }) {
    const { orderId } = payload;
    client.leave(`order_${orderId}`);
    const room = this.orderRooms.get(orderId);
    if (room) {
      room.delete(client.id);
      if (room.size === 0) this.orderRooms.delete(orderId);
    }
    return { event: 'left', room: `order_${orderId}` };
  }

  @SubscribeMessage('get_order_status')
  handleGetOrderStatus(client: Socket, payload: { orderId: string }) {
    this.server.to(`order_${payload.orderId}`).emit('order_status_refresh', { orderId: payload.orderId });
    return { event: 'status_requested', orderId: payload.orderId };
  }

  @SubscribeMessage('update_location')
  handleLocationUpdate(client: Socket, payload: any) {
    const { orderId, lat, lng } = payload;
    // Emit to everyone in the order room with correct event name
    this.server.to(`order_${orderId}`).emit('location_update', {
      orderId, lat, lng, timestamp: new Date().toISOString(),
    });
  }
}
