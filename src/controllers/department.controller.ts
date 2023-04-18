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
import {Department} from '../models';
import {DepartmentRepository} from '../repositories';

export class DepartmentController {
  constructor(
    @repository(DepartmentRepository)
    public departmentRepository: DepartmentRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuDepartmentId, SecurityConfig.createAction],
  })
  @post('/department')
  @response(200, {
    description: 'Department model instance',
    content: {'application/json': {schema: getModelSchemaRef(Department)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Department, {
            title: 'NewDepartment',
            exclude: ['id'],
          }),
        },
      },
    })
    department: Omit<Department, 'id'>,
  ): Promise<Department> {
    return this.departmentRepository.create(department);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuDepartmentId, SecurityConfig.listAction],
  })
  @get('/department/count')
  @response(200, {
    description: 'Department model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Department) where?: Where<Department>,
  ): Promise<Count> {
    return this.departmentRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuDepartmentId, SecurityConfig.listAction],
  })
  @get('/department')
  @response(200, {
    description: 'Array of Department model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Department, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Department) filter?: Filter<Department>,
  ): Promise<Department[]> {
    return this.departmentRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuDepartmentId, SecurityConfig.editAction],
  })
  @patch('/department')
  @response(200, {
    description: 'Department PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Department, {partial: true}),
        },
      },
    })
    department: Department,
    @param.where(Department) where?: Where<Department>,
  ): Promise<Count> {
    return this.departmentRepository.updateAll(department, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuDepartmentId, SecurityConfig.listAction],
  })
  @get('/department/{id}')
  @response(200, {
    description: 'Department model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Department, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Department, {exclude: 'where'})
    filter?: FilterExcludingWhere<Department>,
  ): Promise<Department> {
    return this.departmentRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuDepartmentId, SecurityConfig.editAction],
  })
  @patch('/department/{id}')
  @response(204, {
    description: 'Department PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Department, {partial: true}),
        },
      },
    })
    department: Department,
  ): Promise<void> {
    await this.departmentRepository.updateById(id, department);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuDepartmentId, SecurityConfig.createAction],
  })
  @put('/department/{id}')
  @response(204, {
    description: 'Department PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() department: Department,
  ): Promise<void> {
    await this.departmentRepository.replaceById(id, department);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuDepartmentId, SecurityConfig.deleteAction],
  })
  @del('/department/{id}')
  @response(204, {
    description: 'Department DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.departmentRepository.deleteById(id);
  }
}
