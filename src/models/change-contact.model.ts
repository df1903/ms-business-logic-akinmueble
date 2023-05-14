import {Model, model, property} from '@loopback/repository';

@model()
export class ChangeContact extends Model {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  constructor(data?: Partial<ChangeContact>) {
    super(data);
  }
}

export interface ChangeContactRelations {
  // describe navigational properties here
}

export type ChangeContactWithRelations = ChangeContact & ChangeContactRelations;
