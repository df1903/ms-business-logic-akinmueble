import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityConfig} from '../config/security.config';
import {Photo, Property} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyPhotoController {
  constructor(
    @repository(PropertyRepository)
    protected propertyRepository: PropertyRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.listAction],
  })
  @get('/properties/{id}/photos', {
    responses: {
      '200': {
        description: 'Array of Property has many Photo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Photo)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: number,
    @param.query.object('filter') filter?: Filter<Photo>,
  ): Promise<Photo[]> {
    return this.propertyRepository.photos(id).find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.createAction],
  })
  @post('/properties/{id}/photos', {
    responses: {
      '200': {
        description: 'Property model instance',
        content: {'application/json': {schema: getModelSchemaRef(Photo)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Property.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Photo, {
            title: 'NewPhotoInProperty',
            exclude: ['id'],
            optional: ['propertyId'],
          }),
        },
      },
    })
    photo: Omit<Photo, 'id'>,
  ): Promise<Photo> {
    return this.propertyRepository.photos(id).create(photo);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.editAction],
  })
  @patch('/properties/{id}/photos', {
    responses: {
      '200': {
        description: 'Property.Photo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Photo, {partial: true}),
        },
      },
    })
    photo: Partial<Photo>,
    @param.query.object('where', getWhereSchemaFor(Photo)) where?: Where<Photo>,
  ): Promise<Count> {
    return this.propertyRepository.photos(id).patch(photo, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.deleteAction],
  })
  @del('/properties/{id}/photos', {
    responses: {
      '200': {
        description: 'Property.Photo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Photo)) where?: Where<Photo>,
  ): Promise<Count> {
    return this.propertyRepository.photos(id).delete(where);
  }
}
