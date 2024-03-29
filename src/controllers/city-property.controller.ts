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
import {City, Property} from '../models';
import {CityRepository} from '../repositories';

export class CityPropertyController {
  constructor(
    @repository(CityRepository) protected cityRepository: CityRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuCityId, SecurityConfig.listAction],
  })
  @get('/cities/{id}/properties', {
    responses: {
      '200': {
        description: 'Array of City has many Property',
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
    return this.cityRepository.properties(id).find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuCityId, SecurityConfig.createAction],
  })
  @post('/cities/{id}/properties', {
    responses: {
      '200': {
        description: 'City model instance',
        content: {'application/json': {schema: getModelSchemaRef(Property)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof City.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {
            title: 'NewPropertyInCity',
            exclude: ['id'],
            optional: ['cityId'],
          }),
        },
      },
    })
    property: Omit<Property, 'id'>,
  ): Promise<Property> {
    return this.cityRepository.properties(id).create(property);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuCityId, SecurityConfig.editAction],
  })
  @patch('/cities/{id}/properties', {
    responses: {
      '200': {
        description: 'City.Property PATCH success count',
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
    return this.cityRepository.properties(id).patch(property, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuCityId, SecurityConfig.deleteAction],
  })
  @del('/cities/{id}/properties', {
    responses: {
      '200': {
        description: 'City.Property DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Property))
    where?: Where<Property>,
  ): Promise<Count> {
    return this.cityRepository.properties(id).delete(where);
  }
}
