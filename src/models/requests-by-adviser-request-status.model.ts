import {Model, model, property} from '@loopback/repository';

@model()
export class RequestsByAdviserRequestStatus extends Model {
  @property({
    type: 'number',
    required: true,
  })
  adviserId: number;

  @property({
    type: 'number',
    required: true,
  })
  requestStatusId: number;


  constructor(data?: Partial<RequestsByAdviserRequestStatus>) {
    super(data);
  }
}

export interface RequestsByAdviserRequestStatusRelations {
  // describe navigational properties here
}

export type RequestsByAdviserRequestStatusWithRelations = RequestsByAdviserRequestStatus & RequestsByAdviserRequestStatusRelations;
