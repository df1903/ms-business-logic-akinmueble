import {Entity, model, property} from '@loopback/repository';

@model()
export class RequestsByAdviserDate extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  adviserId: number;

  @property({
    type: 'date',
    required: true,
  })
  startDate: string;

  @property({
    type: 'date',
    required: true,
  })
  endDate: string;

  constructor(data?: Partial<RequestsByAdviserDate>) {
    super(data);
  }
}

export interface RequestsByAdviserDateRelations {
  // describe navigational properties here
}

export type RequestsByAdviserDateWithRelations = RequestsByAdviserDate &
  RequestsByAdviserDateRelations;
