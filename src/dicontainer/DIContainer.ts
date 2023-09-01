import IRabbitMQService from "@iservice/IRabbitMQService";

abstract class DIContainer {
    abstract getRabbitMQService():IRabbitMQService;
}

export default DIContainer;