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
import {Property, PropertyType} from '../models';
import {PropertyTypeRepository} from '../repositories';

export class PropertyTypePropertyController {
  constructor(
    @repository(PropertyTypeRepository)
    protected propertyTypeRepository: PropertyTypeRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyTypeId, SecurityConfig.listAction],
  })
  @get('/property-types/{id}/properties', {
    responses: {
      '200': {
        description: 'Array of PropertyType has many Property',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Property)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: number,
    @param.query.object('filter') filter?: Filter<Property>,
  ): Promise<Property[]> {
    return this.propertyTypeRepository.properties(id).find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyTypeId, SecurityConfig.createAction],
  })
  @post('/property-types/{id}/properties', {
    responses: {
      '200': {
        description: 'PropertyType model instance',
        content: {'application/json': {schema: getModelSchemaRef(Property)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof PropertyType.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {
            title: 'NewPropertyInPropertyType',
            exclude: ['id'],
            optional: ['propertyTypeId'],
          }),
        },
      },
    })
    property: Omit<Property, 'id'>,
  ): Promise<Property> {
    return this.propertyTypeRepository.properties(id).create(property);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyTypeId, SecurityConfig.editAction],
  })
  @patch('/property-types/{id}/properties', {
    responses: {
      '200': {
        description: 'PropertyType.Property PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {partial: true}),
        },
      },
    })
    property: Partial<Property>,
    @param.query.object('where', getWhereSchemaFor(Property))
    where?: Where<Property>,
  ): Promise<Count> {
    return this.propertyTypeRepository.properties(id).patch(property, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyTypeId, SecurityConfig.deleteAction],
  })
  @del('/property-types/{id}/properties', {
    responses: {
      '200': {
        description: 'PropertyType.Property DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Property))
    where?: Where<Property>,
  ): Promise<Count> {
    return this.propertyTypeRepository.properties(id).delete(where);
  }
}
