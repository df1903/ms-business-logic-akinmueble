// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {ContactForm} from '../models';
import {NotificationsService} from '../services';

// import {inject} from '@loopback/core';

export class Website {
  constructor(
    @service(NotificationsService)
    private notificationService: NotificationsService,
  ) {}

  /**
   * Form to contact the creative advisor to rent or sell a property
   * @param ContactForm
   * @returns sent= True or not sent = False
   */
  @post('/contact-form')
  @response(200, {
    description: 'Sending the contact form message',
    content: {'application/json': {schema: getModelSchemaRef(ContactForm)}},
  })
  async contactForm(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContactForm),
        },
      },
    })
    data: ContactForm,
  ): Promise<boolean> {
    return this.notificationService.emailPublicForm(data);
  }
}
