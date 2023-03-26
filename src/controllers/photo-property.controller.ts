import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Photo,
  Property,
} from '../models';
import {PhotoRepository} from '../repositories';

export class PhotoPropertyController {
  constructor(
    @repository(PhotoRepository)
    public photoRepository: PhotoRepository,
  ) { }

  @get('/photos/{id}/property', {
    responses: {
      '200': {
        description: 'Property belonging to Photo',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Property),
          },
        },
      },
    },
  })
  async getProperty(
    @param.path.string('id') id: typeof Photo.prototype.id,
  ): Promise<Property> {
    return this.photoRepository.property(id);
  }
}
