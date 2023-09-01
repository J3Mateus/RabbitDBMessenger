import express, { Router } from 'express';
import IRabbitMQService from '@iservice/IRabbitMQService';
import { RabbitMQHandler } from '@handlers/rabbitmqHandler';

export function loadRoutes(service: IRabbitMQService): Router{
    const router = express.Router();
    const handler = new RabbitMQHandler(service);
    router.post("/send/menssage",handler.publishInQueue);
    return router;
}