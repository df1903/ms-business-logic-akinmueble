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
import {City, Department} from '../models';
import {DepartmentRepository} from '../repositories';

export class DepartmentCityController {
  constructor(
    @repository(DepartmentRepository)
    protected departmentRepository: DepartmentRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuDepartmentId, SecurityConfig.listAction],
  })
  @get('/departments/{id}/cities', {
    responses: {
      '200': {
        description: 'Array of Department has many City',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(City)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: number,
    @param.query.object('filter') filter?: Filter<City>,
  ): Promise<City[]> {
    return this.departmentRepository.cities(id).find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuDepartmentId, SecurityConfig.createAction],
  })
  @post('/departments/{id}/cities', {
    responses: {
      '200': {
        description: 'Department model instance',
        content: {'application/json': {schema: getModelSchemaRef(City)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Department.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {
            title: 'NewCityInDepartment',
            exclude: ['id'],
            optional: ['departmentId'],
          }),
        },
      },
    })
    city: Omit<City, 'id'>,
  ): Promise<City> {
    return this.departmentRepository.cities(id).create(city);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuDepartmentId, SecurityConfig.editAction],
  })
  @patch('/departments/{id}/cities', {
    responses: {
      '200': {
        description: 'Department.City PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {partial: true}),
        },
      },
    })
    city: Partial<City>,
    @param.query.object('where', getWhereSchemaFor(City)) where?: Where<City>,
  ): Promise<Count> {
    return this.departmentRepository.cities(id).patch(city, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuDepartmentId, SecurityConfig.deleteAction],
  })
  @del('/departments/{id}/cities', {
    responses: {
      '200': {
        description: 'Department.City DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: number,
    @param.query.object('where', getWhereSchemaFor(City)) where?: Where<City>,
  ): Promise<Count> {
    return this.departmentRepository.cities(id).delete(where);
  }
}
