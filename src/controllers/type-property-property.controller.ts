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
import { Property, TypeProperty } from '../models';
import { TypePropertyRepository } from '../repositories';

export class TypePropertyPropertyController {
  constructor(
    @repository(TypePropertyRepository)
    protected typePropertyRepository: TypePropertyRepository,
  ) {}

  @get('/type-properties/{id}/properties', {
    responses: {
      '200': {
        description: 'Array of TypeProperty has many Property',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Property)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: number,
    @param.query.object('filter') filter?: Filter<Property>,
  ): Promise<Property[]> {
    return this.typePropertyRepository.properties(id).find(filter);
  }

  @post('/type-properties/{id}/properties', {
    responses: {
      '200': {
        description: 'TypeProperty model instance',
        content: {'application/json': {schema: getModelSchemaRef(Property)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof TypeProperty.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {
            title: 'NewPropertyInTypeProperty',
            exclude: ['id'],
            optional: ['typePropertyId'],
          }),
        },
      },
    })
    property: Omit<Property, 'id'>,
  ): Promise<Property> {
    return this.typePropertyRepository.properties(id).create(property);
  }

  @patch('/type-properties/{id}/properties', {
    responses: {
      '200': {
        description: 'TypeProperty.Property PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {partial: true}),
        },
      },
    })
    property: Partial<Property>,
    @param.query.object('where', getWhereSchemaFor(Property))
    where?: Where<Property>,
  ): Promise<Count> {
    return this.typePropertyRepository.properties(id).patch(property, where);
  }

  @del('/type-properties/{id}/properties', {
    responses: {
      '200': {
        description: 'TypeProperty.Property DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Property))
    where?: Where<Property>,
  ): Promise<Count> {
    return this.typePropertyRepository.properties(id).delete(where);
  }
}
