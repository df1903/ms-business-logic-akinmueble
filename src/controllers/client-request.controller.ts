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
import {Client, Request} from '../models';
import {ClientRepository} from '../repositories';

export class ClientRequestController {
  constructor(
    @repository(ClientRepository) protected clientRepository: ClientRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.listAction],
  })
  @get('/clients/{id}/requests', {
    responses: {
      '200': {
        description: 'Array of Client has many Request',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Request)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: number,
    @param.query.object('filter') filter?: Filter<Request>,
  ): Promise<Request[]> {
    return this.clientRepository.requests(id).find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.createAction],
  })
  @post('/clients/{id}/requests', {
    responses: {
      '200': {
        description: 'Client model instance',
        content: {'application/json': {schema: getModelSchemaRef(Request)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Client.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {
            title: 'NewRequestInClient',
            exclude: ['id'],
            optional: ['clientId'],
          }),
        },
      },
    })
    request: Omit<Request, 'id'>,
  ): Promise<Request> {
    return this.clientRepository.requests(id).create(request);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.editAction],
  })
  @patch('/clients/{id}/requests', {
    responses: {
      '200': {
        description: 'Client.Request PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {partial: true}),
        },
      },
    })
    request: Partial<Request>,
    @param.query.object('where', getWhereSchemaFor(Request))
    where?: Where<Request>,
  ): Promise<Count> {
    return this.clientRepository.requests(id).patch(request, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.deleteAction],
  })
  @del('/clients/{id}/requests', {
    responses: {
      '200': {
        description: 'Client.Request DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Request))
    where?: Where<Request>,
  ): Promise<Count> {
    return this.clientRepository.requests(id).delete(where);
  }
}
