import amqplib from "amqplib";
export const exchange = "event_exchanger";
export const exchangeType = "topic";
export const queue = "product_service_queue";
export const setupRabbitMQ = async (): Promise<amqplib.Channel> => {
  try {
    const connection = await amqplib.connect(
      "amqps://rwpugrwv:VNfmzz7MfKI-FkceztDT6UV0O7LGG_cq@lionfish.rmq.cloudamqp.com/rwpugrwv"
    );
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, exchangeType, { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, "product.*");
    return channel;
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error or throw a new error
  }
};
