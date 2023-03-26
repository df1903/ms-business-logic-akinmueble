import {
    repository
} from '@loopback/repository';
import {
    get,
    getModelSchemaRef, param
} from '@loopback/rest';
import {
    Adviser, Request
} from '../models';
import { RequestRepository } from '../repositories';

export class RequestAdviserController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) { }

  @get('/requests/{id}/adviser', {
    responses: {
      '200': {
        description: 'Adviser belonging to Request',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Adviser),
          },
        },
      },
    },
  })
  async getAdviser(
    @param.path.string('id') id: typeof Request.prototype.id,
  ): Promise<Adviser> {
    return this.requestRepository.adviser(id);
  }
}
