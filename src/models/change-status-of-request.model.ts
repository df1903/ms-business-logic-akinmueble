import {Model, model, property} from '@loopback/repository';

@model()
export class ChangeStatusOfRequest extends Model {
  @property({
    type: 'number',
    required: true,
  })
  requestId: number;

  @property({
    type: 'number',
    required: true,
  })
  status: number;

  @property({
    type: 'string',
  })
  comment?: string;

  constructor(data?: Partial<ChangeStatusOfRequest>) {
    super(data);
  }
}

export interface ChangeStatusOfRequestRelations {
  // describe navigational properties here
}

export type ChangeStatusOfRequestWithRelations = ChangeStatusOfRequest &
  ChangeStatusOfRequestRelations;
