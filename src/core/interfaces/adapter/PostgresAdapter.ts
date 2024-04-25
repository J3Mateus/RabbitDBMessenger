import { Pool, QueryResult } from "pg";


abstract class PostgresAdapter {
    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract getPool(): Pool;
}

export default PostgresAdapter;