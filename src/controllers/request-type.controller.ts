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
import {RequestType} from '../models';
import {RequestTypeRepository} from '../repositories';

export class RequestTypeController {
  constructor(
    @repository(RequestTypeRepository)
    public requestTypeRepository: RequestTypeRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestTypeId, SecurityConfig.createAction],
  })
  @post('/request-type')
  @response(200, {
    description: 'RequestType model instance',
    content: {'application/json': {schema: getModelSchemaRef(RequestType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestType, {
            title: 'NewRequestType',
            exclude: ['id'],
          }),
        },
      },
    })
    requestType: Omit<RequestType, 'id'>,
  ): Promise<RequestType> {
    return this.requestTypeRepository.create(requestType);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestTypeId, SecurityConfig.listAction],
  })
  @get('/request-type/count')
  @response(200, {
    description: 'RequestType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RequestType) where?: Where<RequestType>,
  ): Promise<Count> {
    return this.requestTypeRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestTypeId, SecurityConfig.listAction],
  })
  @get('/request-type')
  @response(200, {
    description: 'Array of RequestType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RequestType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RequestType) filter?: Filter<RequestType>,
  ): Promise<RequestType[]> {
    return this.requestTypeRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestTypeId, SecurityConfig.editAction],
  })
  @patch('/request-type')
  @response(200, {
    description: 'RequestType PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestType, {partial: true}),
        },
      },
    })
    requestType: RequestType,
    @param.where(RequestType) where?: Where<RequestType>,
  ): Promise<Count> {
    return this.requestTypeRepository.updateAll(requestType, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestTypeId, SecurityConfig.listAction],
  })
  @get('/request-type/{id}')
  @response(200, {
    description: 'RequestType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RequestType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RequestType, {exclude: 'where'})
    filter?: FilterExcludingWhere<RequestType>,
  ): Promise<RequestType> {
    return this.requestTypeRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestTypeId, SecurityConfig.editAction],
  })
  @patch('/request-type/{id}')
  @response(204, {
    description: 'RequestType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestType, {partial: true}),
        },
      },
    })
    requestType: RequestType,
  ): Promise<void> {
    await this.requestTypeRepository.updateById(id, requestType);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestTypeId, SecurityConfig.createAction],
  })
  @put('/request-type/{id}')
  @response(204, {
    description: 'RequestType PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() requestType: RequestType,
  ): Promise<void> {
    await this.requestTypeRepository.replaceById(id, requestType);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestTypeId, SecurityConfig.deleteAction],
  })
  @del('/request-type/{id}')
  @response(204, {
    description: 'RequestType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.requestTypeRepository.deleteById(id);
  }
}
