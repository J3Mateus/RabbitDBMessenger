import IRabbitMQService from "@iservice/IRabbitMQService";
import { Channel, ConsumeMessage, Message, Replies } from "amqplib";

class RabbitMQService extends IRabbitMQService {
    async ackMessage(message: Message, multiple: boolean): Promise<void> {
        return this.adapter.ackMessage(message,multiple);
    }
    async start(): Promise<Channel> {
        return this.adapter.start();
    }
    async publishInQueue(queue: string, message: string): Promise<boolean> {
        return this.adapter.publishInQueue(queue,message);
    }
    async publishInExchange(exchange: string, routingKey: string, message: string): Promise<boolean> {
       return this.adapter.publishInExchange(exchange,routingKey,message);
    }
    async consume(queue: string, callback:  (message: ConsumeMessage | null ) => void): Promise<Replies.Consume> {
       return this.adapter.consume(queue,callback);
    }
}

export default RabbitMQService;
