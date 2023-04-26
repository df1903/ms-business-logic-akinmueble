import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Property,
  Adviser,
} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyAdviserController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) { }

  @get('/properties/{id}/adviser', {
    responses: {
      '200': {
        description: 'Adviser belonging to Property',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Adviser)},
          },
        },
      },
    },
  })
  async getAdviser(
    @param.path.number('id') id: typeof Property.prototype.id,
  ): Promise<Adviser> {
    return this.propertyRepository.adviser(id);
  }
}
