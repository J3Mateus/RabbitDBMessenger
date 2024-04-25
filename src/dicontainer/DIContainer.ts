import IRabbitMQService from "@iservice/IRabbitMQService";
import IPostgresService from "@iservice/IPostgresService";
import { ISystemService } from "@iservice/ISystemService";

abstract class DIContainer {
    abstract getRabbitMQService():IRabbitMQService;
    abstract getPostgresService():IPostgresService;
    abstract getSystemService():ISystemService;
}

export default DIContainer;