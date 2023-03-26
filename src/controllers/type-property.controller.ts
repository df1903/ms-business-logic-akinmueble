import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {TypeProperty} from '../models';
import {TypePropertyRepository} from '../repositories';

export class TypePropertyController {
  constructor(
    @repository(TypePropertyRepository)
    public typePropertyRepository : TypePropertyRepository,
  ) {}

  @post('/type-properties')
  @response(200, {
    description: 'TypeProperty model instance',
    content: {'application/json': {schema: getModelSchemaRef(TypeProperty)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TypeProperty, {
            title: 'NewTypeProperty',
            exclude: ['id'],
          }),
        },
      },
    })
    typeProperty: Omit<TypeProperty, 'id'>,
  ): Promise<TypeProperty> {
    return this.typePropertyRepository.create(typeProperty);
  }

  @get('/type-properties/count')
  @response(200, {
    description: 'TypeProperty model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TypeProperty) where?: Where<TypeProperty>,
  ): Promise<Count> {
    return this.typePropertyRepository.count(where);
  }

  @get('/type-properties')
  @response(200, {
    description: 'Array of TypeProperty model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TypeProperty, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TypeProperty) filter?: Filter<TypeProperty>,
  ): Promise<TypeProperty[]> {
    return this.typePropertyRepository.find(filter);
  }

  @patch('/type-properties')
  @response(200, {
    description: 'TypeProperty PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TypeProperty, {partial: true}),
        },
      },
    })
    typeProperty: TypeProperty,
    @param.where(TypeProperty) where?: Where<TypeProperty>,
  ): Promise<Count> {
    return this.typePropertyRepository.updateAll(typeProperty, where);
  }

  @get('/type-properties/{id}')
  @response(200, {
    description: 'TypeProperty model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TypeProperty, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TypeProperty, {exclude: 'where'}) filter?: FilterExcludingWhere<TypeProperty>
  ): Promise<TypeProperty> {
    return this.typePropertyRepository.findById(id, filter);
  }

  @patch('/type-properties/{id}')
  @response(204, {
    description: 'TypeProperty PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TypeProperty, {partial: true}),
        },
      },
    })
    typeProperty: TypeProperty,
  ): Promise<void> {
    await this.typePropertyRepository.updateById(id, typeProperty);
  }

  @put('/type-properties/{id}')
  @response(204, {
    description: 'TypeProperty PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() typeProperty: TypeProperty,
  ): Promise<void> {
    await this.typePropertyRepository.replaceById(id, typeProperty);
  }

  @del('/type-properties/{id}')
  @response(204, {
    description: 'TypeProperty DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.typePropertyRepository.deleteById(id);
  }
}
