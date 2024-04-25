import { Pool } from 'pg';
import Credentials from './credentials';
import PostgresAdapter from '@adapter/PostgresAdapter';

class DatabaseConnection implements PostgresAdapter {
    private _pool: Pool;

    constructor() {
        const credentials = Credentials.SetUpCredentials({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
        this._pool = new Pool(credentials.getPostgresConnectionObject());
    }

    async connect(): Promise<void> {
        try {
            // O método connect não é necessário com Pool, pois as conexões são gerenciadas automaticamente
            console.log('Conexão com o banco de dados estabelecida.');
        } catch (error) {
            console.error('Erro ao conectar com o banco de dados:', error);
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this._pool.end();
            console.log('Conexão com o banco de dados encerrada.');
        } catch (error) {
            console.error('Erro ao encerrar conexão com o banco de dados:', error);
        }
    }

    getPool(): Pool {
        return this._pool;
    }
}

export default DatabaseConnection;
