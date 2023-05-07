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
import {Property} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.createAction],
  })
  @post('/property')
  @response(200, {
    description: 'Property model instance',
    content: {'application/json': {schema: getModelSchemaRef(Property)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {
            title: 'NewProperty',
            exclude: ['id'],
          }),
        },
      },
    })
    property: Omit<Property, 'id'>,
  ): Promise<Property> {
    return this.propertyRepository.create(property);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.listAction],
  })
  @get('/property/count')
  @response(200, {
    description: 'Property model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Property) where?: Where<Property>): Promise<Count> {
    return this.propertyRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.listAction],
  })
  @get('/property')
  @response(200, {
    description: 'Array of Property model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Property, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Property) filter?: Filter<Property>,
  ): Promise<Property[]> {
    return this.propertyRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.listClientAction],
  })
  @get('/property-c')
  @response(200, {
    description: 'Array of Property model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Property, {includeRelations: false}),
        },
      },
    },
  })
  async findClient(): Promise<Property[]> {
    return this.propertyRepository.find();
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.editAction],
  })
  @patch('/property')
  @response(200, {
    description: 'Property PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {partial: true}),
        },
      },
    })
    property: Property,
    @param.where(Property) where?: Where<Property>,
  ): Promise<Count> {
    return this.propertyRepository.updateAll(property, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.listAction],
  })
  @get('/property/{id}')
  @response(200, {
    description: 'Property model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Property, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Property, {exclude: 'where'})
    filter?: FilterExcludingWhere<Property>,
  ): Promise<Property> {
    return this.propertyRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.editAction],
  })
  @patch('/property/{id}')
  @response(204, {
    description: 'Property PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {partial: true}),
        },
      },
    })
    property: Property,
  ): Promise<void> {
    await this.propertyRepository.updateById(id, property);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.editAction],
  })
  @put('/property/{id}')
  @response(204, {
    description: 'Property PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() property: Property,
  ): Promise<void> {
    await this.propertyRepository.replaceById(id, property);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.deleteAction],
  })
  @del('/property/{id}')
  @response(204, {
    description: 'Property DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.propertyRepository.deleteById(id);
  }
}
