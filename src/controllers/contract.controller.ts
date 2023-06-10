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
import {Contract} from '../models';
import {ContractRepository} from '../repositories';

export class ContractController {
  constructor(
    @repository(ContractRepository)
    public contractRepository: ContractRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuContractId, SecurityConfig.createAction],
  })
  @post('/contract')
  @response(200, {
    description: 'Contract model instance',
    content: {'application/json': {schema: getModelSchemaRef(Contract)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contract, {
            title: 'NewContract',
            exclude: ['id'],
          }),
        },
      },
    })
    contract: Omit<Contract, 'id'>,
  ): Promise<Contract> {
    return this.contractRepository.create(contract);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuContractId, SecurityConfig.listAction],
  })
  @get('/contract/count')
  @response(200, {
    description: 'Contract model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Contract) where?: Where<Contract>): Promise<Count> {
    return this.contractRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuContractId, SecurityConfig.listAction],
  })
  @get('/contract')
  @response(200, {
    description: 'Array of Contract model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Contract, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Contract) filter?: Filter<Contract>,
  ): Promise<Object> {
    let total = (await this.contractRepository.count()).count;
    let records = await this.contractRepository.find(filter);
    let res = {
      records: records,
      total: total,
    };
    return res;
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuContractId, SecurityConfig.editAction],
  })
  @patch('/contract')
  @response(200, {
    description: 'Contract PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contract, {partial: true}),
        },
      },
    })
    contract: Contract,
    @param.where(Contract) where?: Where<Contract>,
  ): Promise<Count> {
    return this.contractRepository.updateAll(contract, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuContractId, SecurityConfig.listAction],
  })
  @get('/contract/{id}')
  @response(200, {
    description: 'Contract model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Contract, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Contract, {exclude: 'where'})
    filter?: FilterExcludingWhere<Contract>,
  ): Promise<Contract> {
    return this.contractRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuContractId, SecurityConfig.editAction],
  })
  @patch('/contract/{id}')
  @response(204, {
    description: 'Contract PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contract, {partial: true}),
        },
      },
    })
    contract: Contract,
  ): Promise<void> {
    await this.contractRepository.updateById(id, contract);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuContractId, SecurityConfig.editAction],
  })
  @put('/contract/{id}')
  @response(204, {
    description: 'Contract PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() contract: Contract,
  ): Promise<void> {
    await this.contractRepository.replaceById(id, contract);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuContractId, SecurityConfig.deleteAction],
  })
  @del('/contract/{id}')
  @response(204, {
    description: 'Contract DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.contractRepository.deleteById(id);
  }
}
