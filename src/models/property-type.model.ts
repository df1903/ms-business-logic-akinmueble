import {Entity, hasMany, model, property} from '@loopback/repository';
import {Property} from './property.model';

@model()
export class PropertyType extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  rentParticipationPercentage: number;

  @property({
    type: 'number',
    required: true,
  })
  sellParticipationPercentage: number;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @hasMany(() => Property)
  properties: Property[];

  constructor(data?: Partial<PropertyType>) {
    super(data);
  }
}

export interface PropertyTypeRelations {
  // describe navigational properties here
}

export type PropertyTypeWithRelations = PropertyType & PropertyTypeRelations;
