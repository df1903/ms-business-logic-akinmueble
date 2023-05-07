import {Entity, hasMany, model, property} from '@loopback/repository';
import {Property} from './property.model';
import {Request} from './request.model';

@model()
export class Adviser extends Entity {
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
  document: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  secondName?: string;

  @property({
    type: 'string',
    required: true,
  })
  firstLastname: string;

  @property({
    type: 'string',
  })
  secondLastname?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'boolean',
  })
  accepted: boolean;

  @hasMany(() => Request)
  requests: Request[];

  @hasMany(() => Property)
  properties: Property[];

  constructor(data?: Partial<Adviser>) {
    super(data);
  }
}

export interface AdviserRelations {
  // describe navigational properties here
}

export type AdviserWithRelations = Adviser & AdviserRelations;
