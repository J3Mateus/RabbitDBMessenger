import express from 'express';
import APIDIContainer from '@dicontainer/api';
import { loadRoutes as loadRabbitmqRoutes } from './rabbitmq';

export function loadRoutes(){
    const dicontainer = new APIDIContainer();
    const rabbitMQService = dicontainer.getRabbitMQService();

    const router = express.Router();
    router.use("/rabbitmq",loadRabbitmqRoutes(rabbitMQService));
    return router;
}