import DTO from "../../core/domain/types/DTO";

class Credentials {

    private _user: string;
    private _password: string;
    private _host: string;
    private _database: string;
    private _port: number;

    constructor(){
        this._user = 'postgres';
        this._password = 'password';
        this._host = 'localhost';
        this._database = 'postgres';
        this._port = 5432;
    }

    static SetUpCredentials(json: DTO): Credentials {
        const obj = new Credentials();
        obj._host = String(json['host']);
        obj._user = String(json['user']);
        obj._password = String(json['password']);
        obj._database = String(json['database']);
        obj._port = Number(json['port']);

        return obj;
    }

    getPostgresConnectionObject(): DTO {
        const json: DTO = {};
        
        json['user'] = this._user;
        json['password'] = this._password;
        json['host'] = this._host;
        json['database'] = this._database;
        json['port'] = this._port;
        
        return json;
    }
}

export default Credentials;
