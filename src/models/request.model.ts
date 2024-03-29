import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Adviser} from './adviser.model';
import {Client} from './client.model';
import {Contract} from './contract.model';
import {Guarantor} from './guarantor.model';
import {Property} from './property.model';
import {RequestStatus} from './request-status.model';
import {RequestType} from './request-type.model';

@model({
  settings: {
    foreignKeys: {
      fk_request_adviserId: {
        name: 'fk_request_adviserId',
        entity: 'Adviser',
        entityKey: 'id',
        foreignKey: 'adviserId',
      },
      fk_request_clientId: {
        name: 'fk_request_clientId',
        entity: 'Client',
        entityKey: 'id',
        foreignKey: 'clientId',
      },
      fk_request_contractId: {
        name: 'fk_request_contractId',
        entity: 'Contract',
        entityKey: 'id',
        foreignKey: 'contractId',
      },
      fk_request_propertyId: {
        name: 'fk_request_propertyId',
        entity: 'Property',
        entityKey: 'id',
        foreignKey: 'propertyId',
      },
      fk_request_guarantorId: {
        name: 'fk_request_guarantorId',
        entity: 'Guarantor',
        entityKey: 'id',
        foreignKey: 'guarantorId',
      },
      fk_request_requestTypeId: {
        name: 'fk_request_requestTypeId',
        entity: 'RequestType',
        entityKey: 'id',
        foreignKey: 'requestTypeId',
      },
      fk_request_requestStatusId: {
        name: 'fk_request_requestStatusId',
        entity: 'RequestStatus',
        entityKey: 'id',
        foreignKey: 'requestStatusId',
      },
    },
  },
})
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
    type: 'string',
  })
  comment: string;

  @property({
    type: 'date',
  })
  endOfRent: string;

  @belongsTo(() => Adviser)
  adviserId: number;

  @belongsTo(() => Client)
  clientId: number;

  @belongsTo(() => Contract)
  contractId: number;

  @belongsTo(() => Guarantor)
  guarantorId: number;

  @belongsTo(() => Property)
  propertyId: number;

  @belongsTo(() => RequestType)
  requestTypeId: number;

  @belongsTo(() => RequestStatus)
  requestStatusId: number;

  constructor(data?: Partial<Request>) {
    super(data);
  }
}

export interface RequestRelations {
  // describe navigational properties here
}

export type RequestWithRelations = Request & RequestRelations;
