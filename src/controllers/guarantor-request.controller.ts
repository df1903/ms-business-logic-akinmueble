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
import { Guarantor, Request } from '../models';
import { GuarantorRepository } from '../repositories';

export class GuarantorRequestController {
  constructor(
    @repository(GuarantorRepository)
    protected guarantorRepository: GuarantorRepository,
  ) {}

  @get('/guarantors/{id}/requests', {
    responses: {
      '200': {
        description: 'Array of Guarantor has many Request',
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
    return this.guarantorRepository.requests(id).find(filter);
  }

  @post('/guarantors/{id}/requests', {
    responses: {
      '200': {
        description: 'Guarantor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Request)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Guarantor.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {
            title: 'NewRequestInGuarantor',
            exclude: ['id'],
            optional: ['guarantorId'],
          }),
        },
      },
    })
    request: Omit<Request, 'id'>,
  ): Promise<Request> {
    return this.guarantorRepository.requests(id).create(request);
  }

  @patch('/guarantors/{id}/requests', {
    responses: {
      '200': {
        description: 'Guarantor.Request PATCH success count',
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
    return this.guarantorRepository.requests(id).patch(request, where);
  }

  @del('/guarantors/{id}/requests', {
    responses: {
      '200': {
        description: 'Guarantor.Request DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Request))
    where?: Where<Request>,
  ): Promise<Count> {
    return this.guarantorRepository.requests(id).delete(where);
  }
}
