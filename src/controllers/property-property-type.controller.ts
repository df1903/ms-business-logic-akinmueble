import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {SecurityConfig} from '../config/security.config';
import {Property, PropertyType} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyPropertyTypeController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.listAction],
  })
  @get('/properties/{id}/property-type', {
    responses: {
      '200': {
        description: 'PropertyType belonging to Property',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PropertyType),
          },
        },
      },
    },
  })
  async getPropertyType(
    @param.path.string('id') id: typeof Property.prototype.id,
  ): Promise<PropertyType> {
    return this.propertyRepository.propertyType(id);
  }
}
