import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {SecurityConfig} from '../config/security.config';
import {Client, Request} from '../models';
import {RequestRepository} from '../repositories';

export class RequestClientController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.listAction],
  })
  @get('/requests/{id}/client', {
    responses: {
      '200': {
        description: 'Client belonging to Request',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Client),
          },
        },
      },
    },
  })
  async getClient(
    @param.path.string('id') id: typeof Request.prototype.id,
  ): Promise<Client> {
    return this.requestRepository.client(id);
  }
}
