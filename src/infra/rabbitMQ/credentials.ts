import DTO from "../../core/domain/types/DTO";

class Credentials {

    private _protocol: string;
    private _hostname: string;
    private _port: number;
    private _username: string;
    private _password: string;
    private _vhost: string;

    constructor(){
        this._protocol = 'amqp';
        this._hostname = 'localhost';
        this._port = 5672;
        this._username = 'guest';
        this._password = 'guest';
        this._vhost = '/'
    }

    static SetUpCredentials(json: DTO): Credentials{
        const obj = new Credentials()
        obj._hostname = String(json['hostname']);
        obj._protocol = String(json['protocol']);
        obj._port = Number(json['port']);
        obj._username = String(json['username']);
        obj._password = String(json['password']);
        obj._vhost = String(json['vhost'])

        return obj;
    }

    getRabbitMQConnectionObject(): DTO{
        const json: DTO = {};
        
        json['hostname'] = this._hostname;
        json['protocol'] = this._protocol;
        json['port'] = this._port;
        json['username'] = this._username;
        json['password'] = this._password;
        json['vhost'] =  this._vhost;
        
        return json
    }
}

export default Credentials;