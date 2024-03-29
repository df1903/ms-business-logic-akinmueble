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
import {City} from '../models';
import {CityRepository} from '../repositories';

export class CityController {
  constructor(
    @repository(CityRepository)
    public cityRepository: CityRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuCityId, SecurityConfig.createAction],
  })
  @post('/city')
  @response(200, {
    description: 'City model instance',
    content: {'application/json': {schema: getModelSchemaRef(City)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {
            title: 'NewCity',
            exclude: ['id'],
          }),
        },
      },
    })
    city: Omit<City, 'id'>,
  ): Promise<City> {
    return this.cityRepository.create(city);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuCityId, SecurityConfig.listAction],
  })
  @get('/city/count')
  @response(200, {
    description: 'City model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(City) where?: Where<City>): Promise<Count> {
    return this.cityRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuCityId, SecurityConfig.listAction],
  })
  @get('/city')
  @response(200, {
    description: 'Array of City model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(City, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(City) filter?: Filter<City>): Promise<Object> {
    let total = (await this.cityRepository.count()).count;
    let records = await this.cityRepository.find(filter);
    let res = {
      records: records,
      total: total,
    };
    return res;
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuCityId, SecurityConfig.editAction],
  })
  @patch('/city')
  @response(200, {
    description: 'City PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {partial: true}),
        },
      },
    })
    city: City,
    @param.where(City) where?: Where<City>,
  ): Promise<Count> {
    return this.cityRepository.updateAll(city, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuCityId, SecurityConfig.listAction],
  })
  @get('/city/{id}')
  @response(200, {
    description: 'City model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(City, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(City, {exclude: 'where'}) filter?: FilterExcludingWhere<City>,
  ): Promise<City> {
    return this.cityRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuCityId, SecurityConfig.editAction],
  })
  @patch('/city/{id}')
  @response(204, {
    description: 'City PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {partial: true}),
        },
      },
    })
    city: City,
  ): Promise<void> {
    await this.cityRepository.updateById(id, city);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuCityId, SecurityConfig.editAction],
  })
  @put('/city/{id}')
  @response(204, {
    description: 'City PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() city: City,
  ): Promise<void> {
    await this.cityRepository.replaceById(id, city);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuCityId, SecurityConfig.deleteAction],
  })
  @del('/city/{id}')
  @response(204, {
    description: 'City DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.cityRepository.deleteById(id);
  }
}
