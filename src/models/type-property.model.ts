import {Entity, hasMany, model, property} from '@loopback/repository';
import {Property} from './property.model';

@model()
export class TypeProperty extends Entity {
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

  @hasMany(() => Property)
  properties: Property[];

  constructor(data?: Partial<TypeProperty>) {
    super(data);
  }
}

export interface TypePropertyRelations {
  // describe navigational properties here
}

export type TypePropertyWithRelations = TypeProperty & TypePropertyRelations;
