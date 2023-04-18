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
import {RequestStatus} from '../models';
import {RequestStatusRepository} from '../repositories';

export class RequestStatusController {
  constructor(
    @repository(RequestStatusRepository)
    public requestStatusRepository: RequestStatusRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.createAction],
  })
  @post('/request-status')
  @response(200, {
    description: 'RequestStatus model instance',
    content: {'application/json': {schema: getModelSchemaRef(RequestStatus)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestStatus, {
            title: 'NewRequestStatus',
            exclude: ['id'],
          }),
        },
      },
    })
    requestStatus: Omit<RequestStatus, 'id'>,
  ): Promise<RequestStatus> {
    return this.requestStatusRepository.create(requestStatus);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.listAction],
  })
  @get('/request-status/count')
  @response(200, {
    description: 'RequestStatus model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RequestStatus) where?: Where<RequestStatus>,
  ): Promise<Count> {
    return this.requestStatusRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.listAction],
  })
  @get('/request-status')
  @response(200, {
    description: 'Array of RequestStatus model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RequestStatus, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RequestStatus) filter?: Filter<RequestStatus>,
  ): Promise<RequestStatus[]> {
    return this.requestStatusRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.editAction],
  })
  @patch('/request-status')
  @response(200, {
    description: 'RequestStatus PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestStatus, {partial: true}),
        },
      },
    })
    requestStatus: RequestStatus,
    @param.where(RequestStatus) where?: Where<RequestStatus>,
  ): Promise<Count> {
    return this.requestStatusRepository.updateAll(requestStatus, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.listAction],
  })
  @get('/request-status/{id}')
  @response(200, {
    description: 'RequestStatus model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RequestStatus, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RequestStatus, {exclude: 'where'})
    filter?: FilterExcludingWhere<RequestStatus>,
  ): Promise<RequestStatus> {
    return this.requestStatusRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.editAction],
  })
  @patch('/request-status/{id}')
  @response(204, {
    description: 'RequestStatus PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestStatus, {partial: true}),
        },
      },
    })
    requestStatus: RequestStatus,
  ): Promise<void> {
    await this.requestStatusRepository.updateById(id, requestStatus);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.createAction],
  })
  @put('/request-status/{id}')
  @response(204, {
    description: 'RequestStatus PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() requestStatus: RequestStatus,
  ): Promise<void> {
    await this.requestStatusRepository.replaceById(id, requestStatus);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.deleteAction],
  })
  @del('/request-status/{id}')
  @response(204, {
    description: 'RequestStatus DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.requestStatusRepository.deleteById(id);
  }
}
