import IRabbitMQService from "@iservice/IRabbitMQService";
import { Message } from "amqplib";

class RabbitMQService extends IRabbitMQService {
    async start(): Promise<void> {
        return this.adapter.start();
    }
    async publishInQueue(queue: string, message: string): Promise<boolean> {
        return this.adapter.publishInQueue(queue,message);
    }
    async publishInExchange(exchange: string, routingKey: string, message: string): Promise<boolean> {
       return this.adapter.publishInExchange(exchange,routingKey,message);
    }
    async consume(queue: string, callback: (message: Message) => void): Promise<void> {
       return this.adapter.consume(queue,callback);
    }
}

export default RabbitMQService;
