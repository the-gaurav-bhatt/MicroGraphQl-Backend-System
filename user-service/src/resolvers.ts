import bcrypt from "bcrypt";
import { User } from "./model/userModel";
import { GraphQLError } from "graphql";
import { generateToken } from "./utils/auth";
import { Context } from "./index";
import { exchange } from "./utils/rabbitmq";

type RegisterUserType = {
  username: string;
  email: string;
  password: string;
};
export const resolvers = {
  User: {
    __resolveReference: async (ref: { id: string }) => {
      return await User.findById(ref.id);
    },
    orders: async (user: any) => {
      // Fetch Order entity representations based on the user's order IDs
      const orderIds = user.orderIds;
      return orderIds.map((orderId: any) => ({
        __typename: "Order",
        id: orderId,
      }));
    },
  },
  Query: {
    users: async () => {
      return await User.find();
    },
    user: async (_: any, { id }: { id: String }) => {
      return await User.findById(id);
    },
  },

  Mutation: {
    registerUser: async (
      _: any,
      { username, email, password }: RegisterUserType,
      context: Context
    ) => {
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new GraphQLError("User already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      const token = generateToken(newUser._id as string);
      const channel = context.rabbitmqChannel;
      if (channel) {
        const event = {
          type: "userRegistered",
          payload: {
            userId: newUser._id,
            username: newUser.username,
            email: newUser.email,
          },
        };
        channel.publish(
          exchange,
          "user.created",
          Buffer.from(JSON.stringify(event))
        );
        console.log("Published UserRegistered event");
      }
      return { token, user: newUser };
    },
    loginUser: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError("Invalid credentials");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new GraphQLError("Invalid credentials");
      }

      const token = generateToken(user._id as string);

      return { token, user };
    },
    updateUserProfile: async (
      _: any,
      {
        id,
        username,
        email,
      }: {
        id: string;
        username: string;
        email: string;
      },
      context: Context
    ) => {
      const user = await User.findByIdAndUpdate(
        id,
        { username, email },
        { new: true }
      );
      if (!user) {
        throw new GraphQLError("User not found");
      }
      const channel = context.rabbitmqChannel;
      if (channel) {
        const event = {
          type: "userUpdated",
          payload: {
            userId: user._id,
            username: user.username,
            email: user.email,
          },
        };
        channel.publish(
          exchange,
          "user.updated",
          Buffer.from(JSON.stringify(event))
        );
        console.log("Published UserUpdated event");
      }
      return user;
    },
  },
};
