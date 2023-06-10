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
import {PropertyType} from '../models';
import {PropertyTypeRepository} from '../repositories';

export class PropertyTypeController {
  constructor(
    @repository(PropertyTypeRepository)
    public propertyTypeRepository: PropertyTypeRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyTypeId, SecurityConfig.createAction],
  })
  @post('/property-type')
  @response(200, {
    description: 'PropertyType model instance',
    content: {'application/json': {schema: getModelSchemaRef(PropertyType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyType, {
            title: 'NewPropertyType',
            exclude: ['id'],
          }),
        },
      },
    })
    propertyType: Omit<PropertyType, 'id'>,
  ): Promise<PropertyType> {
    return this.propertyTypeRepository.create(propertyType);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyTypeId, SecurityConfig.listAction],
  })
  @get('/property-type/count')
  @response(200, {
    description: 'PropertyType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PropertyType) where?: Where<PropertyType>,
  ): Promise<Count> {
    return this.propertyTypeRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyTypeId, SecurityConfig.listAction],
  })
  @get('/property-type')
  @response(200, {
    description: 'Array of PropertyType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PropertyType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PropertyType) filter?: Filter<PropertyType>,
  ): Promise<Object> {
    let total = (await this.propertyTypeRepository.count()).count;
    let records = await this.propertyTypeRepository.find(filter);
    let res = {
      records: records,
      total: total,
    };
    return res;
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyTypeId, SecurityConfig.editAction],
  })
  @patch('/property-type')
  @response(200, {
    description: 'PropertyType PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyType, {partial: true}),
        },
      },
    })
    propertyType: PropertyType,
    @param.where(PropertyType) where?: Where<PropertyType>,
  ): Promise<Count> {
    return this.propertyTypeRepository.updateAll(propertyType, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyTypeId, SecurityConfig.listAction],
  })
  @get('/property-type/{id}')
  @response(200, {
    description: 'PropertyType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PropertyType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PropertyType, {exclude: 'where'})
    filter?: FilterExcludingWhere<PropertyType>,
  ): Promise<PropertyType> {
    return this.propertyTypeRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyTypeId, SecurityConfig.editAction],
  })
  @patch('/property-type/{id}')
  @response(204, {
    description: 'PropertyType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyType, {partial: true}),
        },
      },
    })
    propertyType: PropertyType,
  ): Promise<void> {
    await this.propertyTypeRepository.updateById(id, propertyType);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyTypeId, SecurityConfig.editAction],
  })
  @put('/property-type/{id}')
  @response(204, {
    description: 'PropertyType PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() propertyType: PropertyType,
  ): Promise<void> {
    await this.propertyTypeRepository.replaceById(id, propertyType);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyTypeId, SecurityConfig.deleteAction],
  })
  @del('/property-type/{id}')
  @response(204, {
    description: 'PropertyType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.propertyTypeRepository.deleteById(id);
  }
}
