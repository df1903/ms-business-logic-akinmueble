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
import {Client} from '../models';
import {ClientRepository} from '../repositories';

export class ClientController {
  constructor(
    @repository(ClientRepository)
    public clientRepository: ClientRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.createAction],
  })
  @post('/client')
  @response(200, {
    description: 'Client model instance',
    content: {'application/json': {schema: getModelSchemaRef(Client)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {
            title: 'NewClient',
            exclude: ['id'],
          }),
        },
      },
    })
    client: Omit<Client, 'id'>,
  ): Promise<Client> {
    return this.clientRepository.create(client);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.listAction],
  })
  @get('/client/count')
  @response(200, {
    description: 'Client model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Client) where?: Where<Client>): Promise<Count> {
    return this.clientRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.listAction],
  })
  @get('/client')
  @response(200, {
    description: 'Array of Client model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Client, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Client) filter?: Filter<Client>): Promise<Client[]> {
    return this.clientRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.editAction],
  })
  @patch('/client')
  @response(200, {
    description: 'Client PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {partial: true}),
        },
      },
    })
    client: Client,
    @param.where(Client) where?: Where<Client>,
  ): Promise<Count> {
    return this.clientRepository.updateAll(client, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.listAction],
  })
  @get('/client/{id}')
  @response(200, {
    description: 'Client model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Client, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Client, {exclude: 'where'})
    filter?: FilterExcludingWhere<Client>,
  ): Promise<Client> {
    return this.clientRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.editAction],
  })
  @patch('/client/{id}')
  @response(204, {
    description: 'Client PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {partial: true}),
        },
      },
    })
    client: Client,
  ): Promise<void> {
    await this.clientRepository.updateById(id, client);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.createAction],
  })
  @put('/client/{id}')
  @response(204, {
    description: 'Client PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() client: Client,
  ): Promise<void> {
    await this.clientRepository.replaceById(id, client);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.deleteAction],
  })
  @del('/client/{id}')
  @response(204, {
    description: 'Client DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.clientRepository.deleteById(id);
  }
}
