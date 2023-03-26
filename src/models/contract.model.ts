import {Entity, hasOne, model, property} from '@loopback/repository';
import {Request} from './request.model';

@model()
export class Contract extends Entity {
  @property({
    type: 'number',
    id: true,
    //generated: true,
  })
  id?: number;

  @hasOne(() => Request)
  request: Request;

  constructor(data?: Partial<Contract>) {
    super(data);
  }
}

export interface ContractRelations {
  // describe navigational properties here
}

export type ContractWithRelations = Contract & ContractRelations;
