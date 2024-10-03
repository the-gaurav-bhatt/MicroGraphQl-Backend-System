import { GraphQLError } from "graphql";
import { Product } from "./model/productModel";
import { Channel } from "amqplib";
import { exchange } from "./utils/rabbitmq";

export const resolvers = {
  Product: {
    __resolveReference: async (ref: { id: string }) => {
      return await Product.findById(ref.id);
    },
  },
  Query: {
    product: async (_: any, { id }: { id: string }) => {
      return await Product.findById(id);
    },
    products: async () => {
      return await Product.find();
    },
  },
  Mutation: {
    createProduct: async (
      _: any,
      {
        name,
        description,
        price,
        inventory,
      }: {
        name: string;
        description?: string;
        price: number;
        inventory: number;
      },
      context: any
    ) => {
      if (!context.userId) {
        throw new GraphQLError("You are not authorized to create a product");
      }
      const channel: Channel = context.rabbitMQChannel;
      const newProduct = await Product.create({
        name,
        description,
        price,
        inventory,
      });
      const event = {
        type: "productCreated",
        payload: {
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          inventory: newProduct.inventory,
        },
      };
      channel.publish(
        exchange,
        "product.created",
        Buffer.from(JSON.stringify(event))
      );
      console.log("Published product created Event for", event);
      // Emit "Product Created" event

      return newProduct;
    },
    updateInventory: async (
      _: any,
      { productId, newInventory }: { productId: string; newInventory: number }
    ) => {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { inventory: newInventory },
        { new: true }
      );

      if (!updatedProduct) {
        throw new Error("Product not found");
      }

      // Emit "Inventory Updated" event

      return updatedProduct;
    },
  },
};
