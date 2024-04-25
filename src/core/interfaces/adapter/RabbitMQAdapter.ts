import { Channel, ConsumeMessage, Message, Replies } from "amqplib";

abstract class RabbitMQAdapter {
    abstract start(): Promise<Channel>;
    abstract publishInQueue(queue: string, message: string): Promise<boolean>;
    abstract publishInExchange(exchange: string, routingKey: string, message: string): Promise<boolean>;
    abstract consume(queue: string, callback: (message: ConsumeMessage | null ) => void): Promise<Replies.Consume>;
    abstract ackMessage(message: Message, multiple: boolean): Promise<void> ;
}

export default RabbitMQAdapter;