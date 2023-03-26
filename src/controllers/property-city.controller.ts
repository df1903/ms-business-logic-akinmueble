import {
    repository
} from '@loopback/repository';
import {
    get,
    getModelSchemaRef, param
} from '@loopback/rest';
import {
    City, Property
} from '../models';
import { PropertyRepository } from '../repositories';

export class PropertyCityController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) { }

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
