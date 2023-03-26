import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Adviser} from './adviser.model';
import {Client} from './client.model';
import {Contract} from './contract.model';
import {Guarantor} from './guarantor.model';
import {Property} from './property.model';

@model({
  settings:{
        foreignKeys:[
          {
            fk_request_idGuarantor:{
              name:'fk_request_idGuarantor',
              entity:'Guarantor',
              entityKey:'id',
              foreignKey:'guarantorId'
            }
          },{
            fk_request_idClient:{
              name:'fk_request_idClient',
              entity:'Client',
              entityKey:'id',
              foreignKey:'clientId'
            }
          },{
            fk_request_idAdviser:{
              name:'fk_request_idAdviser',
              entity:'Adviser',
              entityKey:'id',
              foreignKey:'adviserId'
            }
          },{
            fk_request_idProperty:{
              name:'fk_request_idProperty',
              entity:'Property',
              entityKey:'id',
              foreignKey:'propertyId'
            }
          },{
            fk_request_idContract:{
              name:'fk_request_idContract',
              entity:'Contract',
              entityKey:'id',
              foreignKey:'contractId'
            }
          }
        ]
      }
  })
export class Request extends Entity {
  @property({
    type: 'number',
    id: true,
    //generated: true,
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
  adviserId: number;

  @belongsTo(() => Client)
  clientId: number;

  @belongsTo(() => Contract)
  contractId: number;

  @belongsTo(() => Guarantor)
  guarantorId: number;

  @belongsTo(() => Property)
  propertyId: number;

  constructor(data?: Partial<Request>) {
    super(data);
  }
}

export interface RequestRelations {
  // describe navigational properties here
}

export type RequestWithRelations = Request & RequestRelations;