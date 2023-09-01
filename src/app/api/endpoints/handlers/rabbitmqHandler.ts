import { Request,Response } from "express";
import IRabbitMQService from "@iservice/IRabbitMQService";

class RabbitMQHandler {
    constructor (private readonly service: IRabbitMQService){
        this.publishInQueue = this.publishInQueue.bind(this)
    };

    async publishInQueue(req:Request, res:Response){
        await this.service.start()
        await this.service.publishInQueue('nest',JSON.stringify(req.body))
        return res.send(req.body);
    }
}

export { RabbitMQHandler }