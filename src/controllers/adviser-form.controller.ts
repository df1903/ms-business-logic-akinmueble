// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  HttpErrors,
  getModelSchemaRef,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {GeneralConfig} from '../config/general.config';
import {AdviserForm, GeneralSystemVariables} from '../models';
import {GeneralSystemVariablesRepository} from '../repositories';
import {NotificationsService} from '../services';


// import {inject} from '@loopback/core';


export class AdviserFormController {
  constructor(
    @repository (GeneralSystemVariablesRepository)
    public variablesRepository: GeneralSystemVariablesRepository,
    @service(NotificationsService)
    public notificationService: NotificationsService,
  ) {}

  @post('/send-message-advisor-request')
  @response(200, {
    description: 'Sending a request for an advisor through the public form',
    content: {'application/json': {schema: getModelSchemaRef(AdviserForm)}},
  })
  async recoveryPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AdviserForm),
        },
      },
    })
    data: AdviserForm,
  ): Promise<boolean> {
    try {
      let systemVariables: GeneralSystemVariables[] =
        await this.variablesRepository.find();
      if ((await systemVariables).length == 0) {
        throw new HttpErrors[500]('No system variables to perform the process');
      }
      let administratorEmail = systemVariables[0].administratorEmailContact;
      let administratorName = systemVariables[0].administratorNameContact;
      let subject = 'Application for the position of real estate advisor.';
      let content = `Hi ${administratorName}, <br /> A contact message has been received from the website. The information is:
      <br /><br />
      Name: ${data.fullName}<br />
      Document: ${data.document}<br />
      Email: ${data.email}<br />
      Phone: ${data.phone}<br />
      Message type: ${data.messageType}
      <br /><br />
      Message text: ${data.message}

      `;
      let contactData = {
        destinyEmail: administratorEmail,
        destinyName: administratorName,
        emailSubject: subject,
        emailBody: content,
      };
      let sent = this.notificationService.sendNotification(
        contactData,
        GeneralConfig.urlNotificationsEmail,
      );
      return sent;
    } catch (err) {
      throw new HttpErrors[500]('Server error when sending message');
    }
  }
}