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
import {Property, Request} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyRequestController {
  constructor(
    @repository(PropertyRepository)
    protected propertyRepository: PropertyRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.listAction],
  })
  @get('/properties/{id}/requests', {
    responses: {
      '200': {
        description: 'Array of Property has many Request',
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
    return this.propertyRepository.requests(id).find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.createAction],
  })
  @post('/properties/{id}/requests', {
    responses: {
      '200': {
        description: 'Property model instance',
        content: {'application/json': {schema: getModelSchemaRef(Request)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Property.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {
            title: 'NewRequestInProperty',
            exclude: ['id'],
            optional: ['propertyId'],
          }),
        },
      },
    })
    request: Omit<Request, 'id'>,
  ): Promise<Request> {
    return this.propertyRepository.requests(id).create(request);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.editAction],
  })
  @patch('/properties/{id}/requests', {
    responses: {
      '200': {
        description: 'Property.Request PATCH success count',
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
    return this.propertyRepository.requests(id).patch(request, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPropertyId, SecurityConfig.deleteAction],
  })
  @del('/properties/{id}/requests', {
    responses: {
      '200': {
        description: 'Property.Request DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Request))
    where?: Where<Request>,
  ): Promise<Count> {
    return this.propertyRepository.requests(id).delete(where);
  }
}
