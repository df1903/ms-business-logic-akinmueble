// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  HttpErrors,
  getModelSchemaRef,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {GeneralConfig} from '../config/general.config';
import {ContactForm, GeneralSystemVariables} from '../models';
import {GeneralSystemVariablesRepository} from '../repositories';
import {NotificationsService} from '../services';

// import {inject} from '@loopback/core';

export class Website {
  constructor(
    @service(NotificationsService)
    private notificationService: NotificationsService,
    @repository(GeneralSystemVariablesRepository)
    private variablesRepository: GeneralSystemVariablesRepository,
  ) {}

  @post('/contact-form')
  @response(200, {
    description: 'Sending the contact form message',
    content: {'application/json': {schema: getModelSchemaRef(ContactForm)}},
  })
  async recoveryPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContactForm),
        },
      },
    })
    data: ContactForm,
  ): Promise<boolean> {
    try {
      let systemVariables: GeneralSystemVariables[] =
        await this.variablesRepository.find();
      if ((await systemVariables).length == 0) {
        throw new HttpErrors[500]('No system variables to perform the process');
      }
      let administratorEmail = systemVariables[0].administratorEmailContact;
      let administratorName = systemVariables[0].administratorNameContact;
      let subject = 'Contact from the website';
      let content = `Hi ${administratorName}, <br /> A contact message has been received from the website. The information is:<br /><br />
      <ul>
      <li><strong>Name: </strong>${data.fullName}</li>
      <li><strong>Email: </strong>${data.email}</li>
      <li><strong>Phone: </strong>${data.phone}</li>
      <li><strong>Message type: </strong>${data.messageType}</li>
      <li><strong>Message text: </strong>\n${data.message}</li>
      </ul>

      Best regards,
      Real estate support team!!! :-)
      `;
      let contactData = {
        destinyEmail: administratorEmail,
        destinyName: administratorName,
        emailSubject: subject,
        emailBody: content,
      };
      let sent = this.notificationService.sendNotification(
        contactData,
        GeneralConfig.urlNotifications2FA,
      );
      return sent;
    } catch (err) {
      throw new HttpErrors[500]('Server error when sending message');
    }
  }
}