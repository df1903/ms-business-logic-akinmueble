import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Adviser} from './adviser.model';
import {Client} from './client.model';
import {Contract} from './contract.model';
import {Guarantor} from './guarantor.model';
import {Property} from './property.model';

@model()
export class Request extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'boolean',
    required: true,
  })
  sent: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  underReview: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  accepted: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  rejected: boolean;

  @property({
    type: 'string',
    required: true,
  })
  notification: string;

  @property({
    type: 'string',
    required: true,
  })
  comment: string;

  @belongsTo(() => Adviser)
  adviserId: string;

  @belongsTo(() => Client)
  clientId: string;

  @belongsTo(() => Contract)
  contractId: string;

  @belongsTo(() => Guarantor)
  guarantorId: string;

  @belongsTo(() => Property)
  propertyId: string;

  constructor(data?: Partial<Request>) {
    super(data);
  }
}

export interface RequestRelations {
  // describe navigational properties here
}

export type RequestWithRelations = Request & RequestRelations;
