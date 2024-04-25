import IRabbitMQService from "@iservice/IRabbitMQService";
import { ISystemService } from "@iservice/ISystemService";
import { SystemRepository} from "@system/SystemRepository";
import { SystemService } from "@service/SystemService";
import RabbitMQRepository from "@rabbitMQ/rabbitMQRepository";
import RabbitMQService from "@service/RabbitMQService";
import DIContainer from "@dicontainer/DIContainer";
import IPostgresService from "@iservice/IPostgresService";
import PostgresService from "@service/PostgresService";
import DatabaseConnection from "@postgres/postgresRepository";

class APIDIContainer extends DIContainer {
    getSystemService(): ISystemService {
        return new SystemService(new SystemRepository());
    }

    getPostgresService(): IPostgresService {
      return new PostgresService(new DatabaseConnection())
    }
    getRabbitMQService(): IRabbitMQService {
      return new RabbitMQService(new RabbitMQRepository());
    }   
}

export default APIDIContainer;