import {
    Count,
    CountSchema,
    Filter,
    FilterExcludingWhere,
    repository,
    Where
} from '@loopback/repository';
import {
    del, get,
    getModelSchemaRef, param, patch, post, put, requestBody,
    response
} from '@loopback/rest';
import { Guarantor } from '../models';
import { GuarantorRepository } from '../repositories';

export class GuarantorController {
  constructor(
    @repository(GuarantorRepository)
    public guarantorRepository : GuarantorRepository,
  ) {}

  @post('/guarantors')
  @response(200, {
    description: 'Guarantor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Guarantor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Guarantor, {
            title: 'NewGuarantor',
            exclude: ['id'],
          }),
        },
      },
    })
    guarantor: Omit<Guarantor, 'id'>,
  ): Promise<Guarantor> {
    return this.guarantorRepository.create(guarantor);
  }

  @get('/guarantors/count')
  @response(200, {
    description: 'Guarantor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Guarantor) where?: Where<Guarantor>,
  ): Promise<Count> {
    return this.guarantorRepository.count(where);
  }

  @get('/guarantors')
  @response(200, {
    description: 'Array of Guarantor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Guarantor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Guarantor) filter?: Filter<Guarantor>,
  ): Promise<Guarantor[]> {
    return this.guarantorRepository.find(filter);
  }

  @patch('/guarantors')
  @response(200, {
    description: 'Guarantor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Guarantor, {partial: true}),
        },
      },
    })
    guarantor: Guarantor,
    @param.where(Guarantor) where?: Where<Guarantor>,
  ): Promise<Count> {
    return this.guarantorRepository.updateAll(guarantor, where);
  }

  @get('/guarantors/{id}')
  @response(200, {
    description: 'Guarantor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Guarantor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Guarantor, {exclude: 'where'}) filter?: FilterExcludingWhere<Guarantor>
  ): Promise<Guarantor> {
    return this.guarantorRepository.findById(id, filter);
  }

  @patch('/guarantors/{id}')
  @response(204, {
    description: 'Guarantor PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Guarantor, {partial: true}),
        },
      },
    })
    guarantor: Guarantor,
  ): Promise<void> {
    await this.guarantorRepository.updateById(id, guarantor);
  }

  @put('/guarantors/{id}')
  @response(204, {
    description: 'Guarantor PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() guarantor: Guarantor,
  ): Promise<void> {
    await this.guarantorRepository.replaceById(id, guarantor);
  }

  @del('/guarantors/{id}')
  @response(204, {
    description: 'Guarantor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.guarantorRepository.deleteById(id);
  }
}
