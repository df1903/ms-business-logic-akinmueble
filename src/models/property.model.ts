import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {City} from './city.model';
import {Photo} from './photo.model';
import {PropertyType} from './property-type.model';
import {Request} from './request.model';

@model({
  settings: {
    foreignKeys: {
      fk_property_cityId: {
        name: 'fk_property_cityId',
        entity: 'City',
        entityKey: 'id',
        foreignKey: 'cityId',
      },
      fk_property_propertyTypeId: {
        name: 'fk_property_propertyTypeId',
        entity: 'PropertyType',
        entityKey: 'id',
        foreignKey: 'propertyTypeId',
      },
    },
  },
})
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
  })
  salePrice: number;
  @property({
    type: 'number',
  })
  rentalPrice: number;

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

  @belongsTo(() => PropertyType)
  propertyTypeId: number;

  @hasMany(() => Photo)
  photos: Photo[];

  @belongsTo(() => City)
  cityId: number;

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
