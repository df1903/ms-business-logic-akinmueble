import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {Adviser, Request} from '../models';
import {AdviserRepository} from '../repositories';

export class AdviserRequestController {
  constructor(
    @repository(AdviserRepository)
    protected adviserRepository: AdviserRepository,
  ) {}

  @get('/advisers/{id}/requests', {
    responses: {
      '200': {
        description: 'Array of Adviser has many Request',
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
    return this.adviserRepository.requests(id).find(filter);
  }

  @post('/advisers/{id}/requests', {
    responses: {
      '200': {
        description: 'Adviser model instance',
        content: {'application/json': {schema: getModelSchemaRef(Request)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Adviser.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {
            title: 'NewRequestInAdviser',
            exclude: ['id'],
            optional: ['adviserId'],
          }),
        },
      },
    })
    request: Omit<Request, 'id'>,
  ): Promise<Request> {
    return this.adviserRepository.requests(id).create(request);
  }

  @patch('/advisers/{id}/requests', {
    responses: {
      '200': {
        description: 'Adviser.Request PATCH success count',
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
    return this.adviserRepository.requests(id).patch(request, where);
  }

  @del('/advisers/{id}/requests', {
    responses: {
      '200': {
        description: 'Adviser.Request DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Request))
    where?: Where<Request>,
  ): Promise<Count> {
    return this.adviserRepository.requests(id).delete(where);
  }
}
