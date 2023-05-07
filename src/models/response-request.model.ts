import {Model, model, property} from '@loopback/repository';

@model()
export class ResponseRequest extends Model {
  @property({
    type: 'number',
    required: true,
  })
  requestId: number;

  @property({
    type: 'string',
    required: true,
  })
  comment: string;

  @property({
    type: 'number',
    required: true,
  })
  requestStatusId: number;


  constructor(data?: Partial<ResponseRequest>) {
    super(data);
  }
}

export interface ResponseRequestRelations {
  // describe navigational properties here
}

export type ResponseRequestWithRelations = ResponseRequest & ResponseRequestRelations;
