import amqplib from "amqplib";
export const exchange = "event_exchanger";
export const exchangeType = "topic";
export const queue = "user_service_queue";
export const setupRabbitMQ = async (): Promise<amqplib.Channel> => {
  try {
    const connection = await amqplib.connect(
      "amqps://rwpugrwv:VNfmzz7MfKI-FkceztDT6UV0O7LGG_cq@lionfish.rmq.cloudamqp.com/rwpugrwv"
    );
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, exchangeType);
    await channel.assertQueue(queue);
    await channel.bindQueue(queue, exchange, "user.*");
    return channel;
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error or throw a new error
  }
};
