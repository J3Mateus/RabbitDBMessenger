import PostgresAdapter from "@adapter/PostgresAdapter";
import { Pool, QueryResult } from 'pg';

abstract class IPostgresService {
    constructor(protected readonly adapter: PostgresAdapter) {}

    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract getPool(): Promise<Pool>; 
}

export default IPostgresService;
