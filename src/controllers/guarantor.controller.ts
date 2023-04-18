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
import {Guarantor} from '../models';
import {GuarantorRepository} from '../repositories';

export class GuarantorController {
  constructor(
    @repository(GuarantorRepository)
    public guarantorRepository: GuarantorRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuGuarantorId, SecurityConfig.createAction],
  })
  @post('/guarantor')
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

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuGuarantorId, SecurityConfig.listAction],
  })
  @get('/guarantor/count')
  @response(200, {
    description: 'Guarantor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Guarantor) where?: Where<Guarantor>,
  ): Promise<Count> {
    return this.guarantorRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuGuarantorId, SecurityConfig.listAction],
  })
  @get('/guarantor')
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

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuGuarantorId, SecurityConfig.editAction],
  })
  @patch('/guarantor')
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

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuGuarantorId, SecurityConfig.listAction],
  })
  @get('/guarantor/{id}')
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
    @param.filter(Guarantor, {exclude: 'where'})
    filter?: FilterExcludingWhere<Guarantor>,
  ): Promise<Guarantor> {
    return this.guarantorRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuGuarantorId, SecurityConfig.editAction],
  })
  @patch('/guarantor/{id}')
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

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuGuarantorId, SecurityConfig.createAction],
  })
  @put('/guarantor/{id}')
  @response(204, {
    description: 'Guarantor PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() guarantor: Guarantor,
  ): Promise<void> {
    await this.guarantorRepository.replaceById(id, guarantor);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuGuarantorId, SecurityConfig.deleteAction],
  })
  @del('/guarantor/{id}')
  @response(204, {
    description: 'Guarantor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.guarantorRepository.deleteById(id);
  }
}
