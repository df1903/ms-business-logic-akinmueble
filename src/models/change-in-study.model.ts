import {Model, model, property} from '@loopback/repository';

@model()
export class ChangeInStudy extends Model {
  @property({
    type: 'number',
    required: true,
  })
  requestId: number;


  constructor(data?: Partial<ChangeInStudy>) {
    super(data);
  }
}

export interface ChangeInStudyRelations {
  // describe navigational properties here
}

export type ChangeInStudyWithRelations = ChangeInStudy & ChangeInStudyRelations;
