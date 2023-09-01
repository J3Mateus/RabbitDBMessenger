import { Message } from "amqplib";

abstract class RabbitMQAdapter {
    abstract start(): Promise<void>;
    abstract publishInQueue(queue: string, message: string): Promise<boolean>;
    abstract publishInExchange(exchange: string, routingKey: string, message: string): Promise<boolean>;
    abstract consume(queue: string, callback: (message: Message) => void): Promise<void>;
}

export default RabbitMQAdapter;