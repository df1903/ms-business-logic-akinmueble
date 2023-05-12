import {Model, model, property} from '@loopback/repository';

@model()
export class ClientValidationHash extends Model {
  @property({
    type: 'string',
    required: true,
  })
  hashCode: string;


  constructor(data?: Partial<ClientValidationHash>) {
    super(data);
  }
}

export interface ClientValidationHashRelations {
  // describe navigational properties here
}

export type ClientValidationHashWithRelations = ClientValidationHash & ClientValidationHashRelations;
