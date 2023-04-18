import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {SecurityConfig} from '../config/security.config';
import {Request, RequestStatus} from '../models';
import {RequestRepository} from '../repositories';

export class RequestRequestStatusController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.listAction],
  })
  @get('/requests/{id}/request-status', {
    responses: {
      '200': {
        description: 'RequestStatus belonging to Request',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RequestStatus)},
          },
        },
      },
    },
  })
  async getRequestStatus(
    @param.path.number('id') id: typeof Request.prototype.id,
  ): Promise<RequestStatus> {
    return this.requestRepository.requestStatus(id);
  }
}
