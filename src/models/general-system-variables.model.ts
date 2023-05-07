import {Entity, model, property} from '@loopback/repository';

@model()
export class GeneralSystemVariables extends Entity {
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
  realEstateName: string;

  @property({
    type: 'string',
    required: true,
  })
  creatorAdviserEmail: string;

  @property({
    type: 'string',
    required: true,
  })
  creatorAdviserName: string;

  @property({
    type: 'string',
    required: true,
  })
  administratorEmail: string;

  @property({
    type: 'string',
    required: true,
  })
  administratorName: string;

  constructor(data?: Partial<GeneralSystemVariables>) {
    super(data);
  }
}

export interface GeneralSystemVariablesRelations {
  // describe navigational properties here
}

export type GeneralSystemVariablesWithRelations = GeneralSystemVariables &
  GeneralSystemVariablesRelations;
