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
import { Contract, Request } from '../models';
import { ContractRepository } from '../repositories';

export class ContractRequestController {
  constructor(
    @repository(ContractRepository)
    protected contractRepository: ContractRepository,
  ) {}

  @get('/contracts/{id}/request', {
    responses: {
      '200': {
        description: 'Contract has one Request',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Request),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: number,
    @param.query.object('filter') filter?: Filter<Request>,
  ): Promise<Request> {
    return this.contractRepository.request(id).get(filter);
  }

  @post('/contracts/{id}/request', {
    responses: {
      '200': {
        description: 'Contract model instance',
        content: {'application/json': {schema: getModelSchemaRef(Request)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Contract.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {
            title: 'NewRequestInContract',
            exclude: ['id'],
            optional: ['contractId'],
          }),
        },
      },
    })
    request: Omit<Request, 'id'>,
  ): Promise<Request> {
    return this.contractRepository.request(id).create(request);
  }

  @patch('/contracts/{id}/request', {
    responses: {
      '200': {
        description: 'Contract.Request PATCH success count',
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
    return this.contractRepository.request(id).patch(request, where);
  }

  @del('/contracts/{id}/request', {
    responses: {
      '200': {
        description: 'Contract.Request DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Request))
    where?: Where<Request>,
  ): Promise<Count> {
    return this.contractRepository.request(id).delete(where);
  }
}
