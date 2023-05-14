import {Model, model, property} from '@loopback/repository';

@model()
export class AssignToRequest extends Model {
  @property({
    type: 'number',
    required: true,
  })
  requestId: number;

  @property({
    type: 'number',
    required: true,
  })
  id: number;

  constructor(data?: Partial<AssignToRequest>) {
    super(data);
  }
}

export interface AssignToRequestRelations {
  // describe navigational properties here
}

export type AssignToRequestWithRelations = AssignToRequest &
  AssignToRequestRelations;
