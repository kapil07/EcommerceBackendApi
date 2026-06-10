import { prisma } from "../../lib/prisma.js";
import { ICartRepository } from "./cart.interface.js";

export class CartRepository implements ICartRepository {
  async getCartByUserId(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    return cart;
  }

  async createCart(userId: string) {
    const createdCart = await prisma.cart.create({
      data: {
        userId,
      },
    });

    return createdCart;
  }

  async getCartWithItems(userId: string) {
    const cartWithItems = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return cartWithItems;
  }

  async getCartItemById(cartItemId: string) {
    const cartItemWithProduct = await prisma.cartItems.findUnique({
      where: {
        id: cartItemId,
      },
      include: {
        product: true,
      },
    });
    return cartItemWithProduct;
  }

  async addItem(cartId: string, productId: string, quantity: number) {
    const existingItems = await prisma.cartItems.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });

    if (existingItems) {
      return prisma.cartItems.update({
        where: {
          id: existingItems.id,
        },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
    }
    return prisma.cartItems.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });
  }

  async updateItemQuantity(cartItemId: string, quantity: number) {
    return prisma.cartItems.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity,
      },
    });
  }

  async removeItem(cartitemId: string) {
    await prisma.cartItems.delete({
      where: {
        id: cartitemId,
      },
    });
  }

  async clearCart(cartId: string) {
    await prisma.cartItems.deleteMany({
      where: {
        cartId,
      },
    });
  }
}
