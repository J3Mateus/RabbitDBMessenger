import IRabbitMQService from "@iservice/IRabbitMQService";
import RabbitMQRepository from "@rabbitMQ/rabbitMQRepository.";
import RabbitMQService from "@service/RabbitMQService";
import DIContainer from "@dicontainer/DIContainer";

class APIDIContainer extends DIContainer {
    getRabbitMQService(): IRabbitMQService {
      return new RabbitMQService(new RabbitMQRepository());
    }   
}

export default APIDIContainer;