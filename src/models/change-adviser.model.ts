import {Entity, model, property} from '@loopback/repository';

@model()
export class ChangeAdviser extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  requestId: number;

  @property({
    type: 'number',
    required: true,
  })
  adviserId: number;


  constructor(data?: Partial<ChangeAdviser>) {
    super(data);
  }
}

export interface ChangeAdviserRelations {
  // describe navigational properties here
}

export type ChangeAdviserWithRelations = ChangeAdviser & ChangeAdviserRelations;
