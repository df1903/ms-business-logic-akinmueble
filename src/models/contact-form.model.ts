import {Model, model, property} from '@loopback/repository';

@model()
export class ContactForm extends Model {
  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'string',
    required: true,
  })
  messageType: string;

  @property({
    type: 'string',
    required: true,
  })
  fullName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  phone?: string;


  constructor(data?: Partial<ContactForm>) {
    super(data);
  }
}

export interface ContactFormRelations {
  // describe navigational properties here
}

export type ContactFormWithRelations = ContactForm & ContactFormRelations;
