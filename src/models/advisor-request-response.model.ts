import {Model, model, property} from '@loopback/repository';

@model()
export class AdviserRequestResponse extends Model {
  @property({
    type: 'number',
    required: true,
  })
  adviserId: number;

  @property({
    type: 'boolean',
    required: true,
  })
  accepted: boolean;

  constructor(data?: Partial<AdviserRequestResponse>) {
    super(data);
  }
}

export interface AdviserRequestResponseRelations {
  // describe navigational properties here
}

export type AdviserRequestResponseWithRelations = AdviserRequestResponse &
  AdviserRequestResponseRelations;
