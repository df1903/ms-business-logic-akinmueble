import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {SecurityConfig} from '../config/security.config';
import {City, Property} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyCityController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.listAction],
  })
  @get('/properties/{id}/city', {
    responses: {
      '200': {
        description: 'City belonging to Property',
        content: {
          'application/json': {
            schema: getModelSchemaRef(City),
          },
        },
      },
    },
  })
  async getCity(
    @param.path.string('id') id: typeof Property.prototype.id,
  ): Promise<City> {
    return this.propertyRepository.city(id);
  }
}
