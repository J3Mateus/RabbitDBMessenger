import { Request,Response } from "express";
import IRabbitMQService from "@iservice/IRabbitMQService";
import { ConsumeMessage } from "amqplib";

class RabbitMQHandler {
    constructor (private readonly service: IRabbitMQService){
        this.publishInQueue = this.publishInQueue.bind(this)
        this.consume = this.consume.bind(this)
    };

    async publishInQueue(req:Request, res:Response){
        await this.service.start()
        await this.service.publishInQueue('nest',JSON.stringify(req.body))
        return res.send(req.body);
    }

    async consume(queue: string,callback: (message: ConsumeMessage | null) => void){
        await this.service.start()
        await this.service.consume(queue,callback)
    }
}

export { RabbitMQHandler }