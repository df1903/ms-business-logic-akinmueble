import {
    repository
} from '@loopback/repository';
import {
    get,
    getModelSchemaRef, param
} from '@loopback/rest';
import {
    Property,
    TypeProperty
} from '../models';
import { PropertyRepository } from '../repositories';

export class PropertyTypePropertyController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) { }

  @get('/properties/{id}/type-property', {
    responses: {
      '200': {
        description: 'TypeProperty belonging to Property',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TypeProperty),
          },
        },
      },
    },
  })
  async getTypeProperty(
    @param.path.string('id') id: typeof Property.prototype.id,
  ): Promise<TypeProperty> {
    return this.propertyRepository.typeProperty(id);
  }
}
