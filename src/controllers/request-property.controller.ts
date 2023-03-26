import {
    repository
} from '@loopback/repository';
import {
    get,
    getModelSchemaRef, param
} from '@loopback/rest';
import {
    Property, Request
} from '../models';
import { RequestRepository } from '../repositories';

export class RequestPropertyController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) { }

  @get('/requests/{id}/property', {
    responses: {
      '200': {
        description: 'Property belonging to Request',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Property),
          },
        },
      },
    },
  })
  async getProperty(
    @param.path.string('id') id: typeof Request.prototype.id,
  ): Promise<Property> {
    return this.requestRepository.property(id);
  }
}
