import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Property} from './property.model';

@model(
  {
  settings: {
    foreignKeys: {
      fk_photo_propertyId: {
        name: "fk_photo_propertyId",
        entity: "Property",
        entityKey: "id",
        foreignKey: "propertyId"
      }
    }
  }
}
)
export class Photo extends Entity {
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
  route: string;

  @belongsTo(() => Property)
  propertyId: number;

  constructor(data?: Partial<Photo>) {
    super(data);
  }
}

export interface PhotoRelations {
  // describe navigational properties here
}

export type PhotoWithRelations = Photo & PhotoRelations;
