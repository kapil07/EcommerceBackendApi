import { prisma } from "../../lib/prisma.js";
import { IOrderRepository } from "./order.interface.js";
import { Order, OrderStatus } from "@prisma/client";

export class OrderRepository implements IOrderRepository {
  async getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
      },
    });

    return order;
  }

  async getOrderByUserId(userId: string) {
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: true,
      },
    });
    return orders;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus){
    const updatedOrder = await prisma.order.update({
        where:{
            id: orderId
        },
        data:{
            status
        }
    })
    return updatedOrder
  }
}
