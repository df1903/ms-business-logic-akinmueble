import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property
} from '@loopback/repository';
import {Department} from './department.model';
import {Property} from './property.model';

@model(/*{
  settings:{
    foreignKeys:{
      fk_city_idDepartment:{
        name:" fk_city_idDepartment",
        entity:"Department",
        entityKey:"id",
        foreignKey:"departmentId"
      }
    }
  }
}*/)
export class City extends Entity {
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
  name: string;


  @belongsTo(() => Department)
  departmentId: number;

  @hasMany(() => Property)
  properties: Property[];

  constructor(data?: Partial<City>) {
    super(data);
  }
}

export interface CityRelations {
  // describe navigational properties here
}

export type CityWithRelations = City & CityRelations;
