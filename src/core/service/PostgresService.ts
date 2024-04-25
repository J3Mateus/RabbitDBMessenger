import IPostgresService from "@iservice/IPostgresService";
import { Channel, ConsumeMessage, Message, Replies } from "amqplib";
import { QueryResult, Pool } from "pg";

class PostgresService extends IPostgresService {
    async connect(): Promise<void> {
       return this.adapter.connect()
    }
    async disconnect(): Promise<void> {
        return this.adapter.disconnect()
    }

    async getPool(): Promise<Pool> {
       return this.adapter.getPool()
    }

}

export default PostgresService;
