import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {SecurityConfig} from '../config/security.config';
import {Property, Request} from '../models';
import {RequestRepository} from '../repositories';

export class RequestPropertyController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.listAction],
  })
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
