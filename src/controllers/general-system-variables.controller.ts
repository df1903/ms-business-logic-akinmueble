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
import {GeneralSystemVariables} from '../models';
import {GeneralSystemVariablesRepository} from '../repositories';

export class GeneralSystemVariablesController {
  constructor(
    @repository(GeneralSystemVariablesRepository)
    public generalSystemVariablesRepository: GeneralSystemVariablesRepository,
  ) {}

  @post('/general-system-variables')
  @response(200, {
    description: 'GeneralSystemVariables model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(GeneralSystemVariables)},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GeneralSystemVariables, {
            title: 'NewGeneralSystemVariables',
            exclude: ['id'],
          }),
        },
      },
    })
    generalSystemVariables: Omit<GeneralSystemVariables, 'id'>,
  ): Promise<GeneralSystemVariables> {
    return this.generalSystemVariablesRepository.create(generalSystemVariables);
  }

  // edit admin data

  @post('/editAdminContact')
  @response(200, {
    description: 'GeneralSystemVariables model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(GeneralSystemVariables)},
    },
  })
  async editAdminContact(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GeneralSystemVariables),
        },
      },
    })
    data: GeneralSystemVariables,
  ): Promise<void | null> {
    let variables = await this.generalSystemVariablesRepository.findOne({
      where: {
        id: 1,
      },
    });
    if (variables) {
      variables.administratorEmail = data.administratorEmail;
      variables.administratorName = data.administratorName;
      let change = await this.generalSystemVariablesRepository.updateById(
        data.id,
        variables,
      );
      return change;
    }
    return null;
  }

  @get('/general-system-variables/count')
  @response(200, {
    description: 'GeneralSystemVariables model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(GeneralSystemVariables) where?: Where<GeneralSystemVariables>,
  ): Promise<Count> {
    return this.generalSystemVariablesRepository.count(where);
  }

  @get('/general-system-variables')
  @response(200, {
    description: 'Array of GeneralSystemVariables model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(GeneralSystemVariables, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(
    @param.filter(GeneralSystemVariables)
    filter?: Filter<GeneralSystemVariables>,
  ): Promise<GeneralSystemVariables[]> {
    return this.generalSystemVariablesRepository.find(filter);
  }

  @patch('/general-system-variables')
  @response(200, {
    description: 'GeneralSystemVariables PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GeneralSystemVariables, {partial: true}),
        },
      },
    })
    generalSystemVariables: GeneralSystemVariables,
    @param.where(GeneralSystemVariables) where?: Where<GeneralSystemVariables>,
  ): Promise<Count> {
    return this.generalSystemVariablesRepository.updateAll(
      generalSystemVariables,
      where,
    );
  }

  @get('/general-system-variables/{id}')
  @response(200, {
    description: 'GeneralSystemVariables model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GeneralSystemVariables, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(GeneralSystemVariables, {exclude: 'where'})
    filter?: FilterExcludingWhere<GeneralSystemVariables>,
  ): Promise<GeneralSystemVariables> {
    return this.generalSystemVariablesRepository.findById(id, filter);
  }

  @patch('/general-system-variables/{id}')
  @response(204, {
    description: 'GeneralSystemVariables PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GeneralSystemVariables, {partial: true}),
        },
      },
    })
    generalSystemVariables: GeneralSystemVariables,
  ): Promise<void> {
    await this.generalSystemVariablesRepository.updateById(
      id,
      generalSystemVariables,
    );
  }

  @put('/general-system-variables/{id}')
  @response(204, {
    description: 'GeneralSystemVariables PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() generalSystemVariables: GeneralSystemVariables,
  ): Promise<void> {
    await this.generalSystemVariablesRepository.replaceById(
      id,
      generalSystemVariables,
    );
  }

  @del('/general-system-variables/{id}')
  @response(204, {
    description: 'GeneralSystemVariables DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.generalSystemVariablesRepository.deleteById(id);
  }
}
