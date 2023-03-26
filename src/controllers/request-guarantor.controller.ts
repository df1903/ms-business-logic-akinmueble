import {
    repository
} from '@loopback/repository';
import {
    get,
    getModelSchemaRef, param
} from '@loopback/rest';
import {
    Guarantor, Request
} from '../models';
import { RequestRepository } from '../repositories';

export class RequestGuarantorController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) { }

  @get('/requests/{id}/guarantor', {
    responses: {
      '200': {
        description: 'Guarantor belonging to Request',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Guarantor),
          },
        },
      },
    },
  })
  async getGuarantor(
    @param.path.string('id') id: typeof Request.prototype.id,
  ): Promise<Guarantor> {
    return this.requestRepository.guarantor(id);
  }
}
