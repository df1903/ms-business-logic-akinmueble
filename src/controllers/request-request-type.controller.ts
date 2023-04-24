import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {SecurityConfig} from '../config/security.config';
import {Request, RequestType} from '../models';
import {RequestRepository} from '../repositories';

export class RequestRequestTypeController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.listAction],
  })
  @get('/requests/{id}/request-type', {
    responses: {
      '200': {
        description: 'RequestType belonging to Request',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RequestType)},
          },
        },
      },
    },
  })
  async getRequestType(
    @param.path.number('id') id: typeof Request.prototype.id,
  ): Promise<RequestType> {
    return this.requestRepository.requestType(id);
  }
}
