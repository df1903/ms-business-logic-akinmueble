import {
    repository
} from '@loopback/repository';
import {
    get,
    getModelSchemaRef, param
} from '@loopback/rest';
import {
    Contract, Request
} from '../models';
import { RequestRepository } from '../repositories';

export class RequestContractController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) { }

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
