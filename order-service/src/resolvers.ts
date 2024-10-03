import { GraphQLError } from "graphql";
import { Order, OrderProduct, OrderDocument } from "./model/oderModel";
import { Channel } from "amqplib";
import { exchange } from "./utils/rabbitmq";

export const resolvers = {
  Order: {
    __resolveReference: async (ref: { id: string }) => {
      return await Order.findById(ref.id);
    },
    // userID: (order: any) => {
    //   return { __typename: "User", id: order.userID }; // Assuming you store userId on the Order object
    // },
    // products: (order: any) => {
    //   return order.products.map((orderProduct: any) => ({
    //     // Assuming you have a products array on the Order object
    //     __typename: "OrderProduct",
    //     productId: { __typename: "Product", id: orderProduct.productId }, // Nested entity representation
    //   }));
    // },
  },
  Query: {
    orders: async () => {
      return await Order.find();
    },
    order: async (_: any, { id }: { id: string }) => {
      return await Order.findById(id);
    },
  },
  Mutation: {
    placeOrder: async (
      _: any,
      {
        userId,
        products,
        totalAmount,
      }: { userId: string; products: any[]; totalAmount: number },
      context: any
    ): Promise<OrderDocument> => {
      if (!context.userId) {
        throw new GraphQLError("Unauthorized access while creating order");
      }
      try {
        const channel: Channel = await context.rabbitMQChannel;
        // Create the Order directly using the provided product prices
        const newOrder = await Order.create({
          userID: userId,
          products, // Use the products array directly
          totalAmount,
          status: "Pending",
          createdAt: new Date(),
        });
        await newOrder.save();
        const orderData = {
          type: "orderPlaced",
          payload: {
            userID: newOrder.userID,
            products: newOrder.products,
            totalAmount: newOrder.totalAmount,
            status: newOrder.status,
            createdAt: newOrder.createdAt,
          },
        };
        if (channel) {
          console.log("Publishing order placement");
          channel.publish(
            exchange,
            "order.placed",
            Buffer.from(JSON.stringify(orderData))
          );
        }
        return newOrder;
      } catch (error) {
        console.error("Error placing order:", error);
        throw error;
      }
    },
  },
};
