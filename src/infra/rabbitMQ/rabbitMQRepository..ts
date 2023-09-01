import { Channel, Connection,Message,connect } from 'amqplib'
import Credentials from '@rabbitMQ/credentials';
import RabbitMQAdapter from '@adapter/RabbitMQAdapter';
import DTO from 'core/domain/types/DTO';

class RabbitMQRepository implements RabbitMQAdapter  {
    
    private _amqpServer: string = '';
    private _connection!: Connection;
    private _channel!: Channel;
    private _client:DTO;
    constructor(){
        const newConnection = Credentials.SetUpCredentials({
            protocol: process.env.RABBITMQ_PROTOCOL,
            hostname: process.env.RABBITMQ_HOSTNAME, 
            port: process.env.RABBITMQ_PORT,   
            username: process.env.RABBITMQ_USERNAME, 
            password: process.env.RABBITMQ_PASSWORD,    
            vhost: process.env.RABBITMQ_VHOST
        });
        const optionObject = newConnection.getRabbitMQConnectionObject()
        this._client = optionObject;
    }

    async start(): Promise<void>{
        this._connection = await connect(this._client);
        this._channel = await this._connection.createChannel();
    }

    async publishInQueue(queue: string, message: string):Promise<boolean> {
        return this._channel.sendToQueue(queue, Buffer.from(message));
      }
      async publishInExchange(exchange: string, routingKey: string, message: string): Promise<boolean> {
        return this._channel.publish(exchange, routingKey, Buffer.from(message));
    }
    async consume(queue: string, callback: (message: Message) => void): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

export default RabbitMQRepository;