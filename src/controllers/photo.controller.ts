import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityConfig} from '../config/security.config';
import {Photo} from '../models';
import {PhotoRepository} from '../repositories';

export class PhotoController {
  constructor(
    @repository(PhotoRepository)
    public photoRepository: PhotoRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPhotoId, SecurityConfig.createAction],
  })
  @post('/photo')
  @response(200, {
    description: 'Photo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Photo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Photo, {
            title: 'NewPhoto',
            exclude: ['id'],
          }),
        },
      },
    })
    photo: Omit<Photo, 'id'>,
  ): Promise<Photo> {
    return this.photoRepository.create(photo);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPhotoId, SecurityConfig.listAction],
  })
  @get('/photo/count')
  @response(200, {
    description: 'Photo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Photo) where?: Where<Photo>): Promise<Count> {
    return this.photoRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPhotoId, SecurityConfig.listAction],
  })
  @get('/photo')
  @response(200, {
    description: 'Array of Photo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Photo, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Photo) filter?: Filter<Photo>): Promise<Photo[]> {
    return this.photoRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPhotoId, SecurityConfig.editAction],
  })
  @patch('/photo')
  @response(200, {
    description: 'Photo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Photo, {partial: true}),
        },
      },
    })
    photo: Photo,
    @param.where(Photo) where?: Where<Photo>,
  ): Promise<Count> {
    return this.photoRepository.updateAll(photo, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPhotoId, SecurityConfig.listAction],
  })
  @get('/photo/{id}')
  @response(200, {
    description: 'Photo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Photo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Photo, {exclude: 'where'})
    filter?: FilterExcludingWhere<Photo>,
  ): Promise<Photo> {
    return this.photoRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPhotoId, SecurityConfig.editAction],
  })
  @patch('/photo/{id}')
  @response(204, {
    description: 'Photo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Photo, {partial: true}),
        },
      },
    })
    photo: Photo,
  ): Promise<void> {
    await this.photoRepository.updateById(id, photo);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPhotoId, SecurityConfig.editAction],
  })
  @put('/photo/{id}')
  @response(204, {
    description: 'Photo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() photo: Photo,
  ): Promise<void> {
    await this.photoRepository.replaceById(id, photo);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPhotoId, SecurityConfig.deleteAction],
  })
  @del('/photo/{id}')
  @response(204, {
    description: 'Photo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.photoRepository.deleteById(id);
  }
}
