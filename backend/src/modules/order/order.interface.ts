import { Order, OrderStatus } from "@prisma/client";

export interface IOrderRepository {
  getOrderById(orderId: string): Promise<Order | null>;
  getOrderByUserId(userId: string): Promise<Order[]>
  updateOrderStatus(orderId: string, status: OrderStatus):Promise<Order>
}
