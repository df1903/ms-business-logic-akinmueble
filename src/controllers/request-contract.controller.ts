import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {SecurityConfig} from '../config/security.config';
import {Contract, Request} from '../models';
import {RequestRepository} from '../repositories';

export class RequestContractController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.listAction],
  })
  @get('/requests/{id}/contract', {
    responses: {
      '200': {
        description: 'Contract belonging to Request',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Contract),
          },
        },
      },
    },
  })
  async getContract(
    @param.path.string('id') id: typeof Request.prototype.id,
  ): Promise<Contract> {
    return this.requestRepository.contract(id);
  }
}
