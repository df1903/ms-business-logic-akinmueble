import {Entity, model, property} from '@loopback/repository';

@model()
export class AdviserChange extends Entity {
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

  constructor(data?: Partial<AdviserChange>) {
    super(data);
  }
}

export interface AdviserChangeRelations {
  // describe navigational properties here
}

export type AdviserChangeWithRelations = AdviserChange & AdviserChangeRelations;
