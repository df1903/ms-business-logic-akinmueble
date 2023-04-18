import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class AdviserForm extends Model {
  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'string',
    required: true,
  })
  messageType: string;

  @property({
    type: 'string',
    required: true,
  })
  fullName: string;

  @property({
    type: 'string',
    required: true,
  })
  document: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  phone?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<AdviserForm>) {
    super(data);
  }
}

export interface AdviserFormRelations {
  // describe navigational properties here
}

export type AdviserFormWithRelations = AdviserForm & AdviserFormRelations;
