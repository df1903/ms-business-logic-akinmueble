import {Model, model, property} from '@loopback/repository';

@model()
export class ClientRequest extends Model {
  @property({
    type: 'number',
    required: true,
  })
  requestId: number;

  @property({
    type: 'number',
    required: true,
  })
  clientId: number;


  constructor(data?: Partial<ClientRequest>) {
    super(data);
  }
}

export interface ClientRequestRelations {
  // describe navigational properties here
}

export type ClientRequestWithRelations = ClientRequest & ClientRequestRelations;
