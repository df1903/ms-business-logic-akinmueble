import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {City} from './city.model';
import {Photo} from './photo.model';
import {Request} from './request.model';
import {TypeProperty} from './type-property.model';

@model()
export class Property extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  direction: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'number',
    required: true,
  })
  participationPercentage: number;

  @property({
    type: 'boolean',
    required: true,
  })
  sell: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  rent: boolean;

  @property({
    type: 'string',
    required: true,
  })
  video: string;

  @belongsTo(() => TypeProperty)
  typePropertyId: string;

  @hasMany(() => Photo)
  photos: Photo[];

  @belongsTo(() => City)
  cityId: string;

  @hasMany(() => Request)
  requests: Request[];

  constructor(data?: Partial<Property>) {
    super(data);
  }
}

export interface PropertyRelations {
  // describe navigational properties here
}

export type PropertyWithRelations = Property & PropertyRelations;
