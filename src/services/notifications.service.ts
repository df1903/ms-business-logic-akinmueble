import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {NotificationsConfig} from '../config/notifications.config';
import {GeneralSystemVariables} from '../models';
import {GeneralSystemVariablesRepository} from '../repositories';

const generator = require('generate-password');

const fetch = require('node-fetch');
@injectable({scope: BindingScope.TRANSIENT})
export class NotificationsService {
  constructor(
    @repository(GeneralSystemVariablesRepository)
    private variablesRepository: GeneralSystemVariablesRepository,
  ) {}

  /*
   * Add service methods here
   */

  /**
   * Method to send notification connected with the notification microservice
   * @param data
   * @param url
   * @returns Boolean
   */
  sendNotification(data: any, url: string): boolean {
    try {
      fetch(url, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'},
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Method to send email when an advisor is changed in a request
   * @param data
   * @returns Boolean
   */
  emailAdviserChange(data: any): Boolean {
    try {
      // Email for original advisor
      let content =
        `Hi ${data.originalAdviser?.firstName}  ${data.originalAdviser?.firstLastname}, <br /> ` +
        `The request you were in charge of has been reassigned` +
        `<br/ ><br/ > >> Request Data << ` +
        `<br/ > Request ID: ${data.request?.id}` +
        `<br/ > Client ID: ${data.request.clientId}` +
        `<br/ > New Adviser ID: ${data.newAdviser.id}` +
        `<br/ > New Adviser Name: ${data.newAdviser.firstName} ${data.newAdviser.firstLastname}`;

      let contactData = {
        destinyEmail: data.originalAdviser?.email,
        destinyName: data.originalAdviser?.firstName,
        emailSubject: NotificationsConfig.emailSubjectAdviserChange,
        emailBody: content,
      };

      this.sendNotification(
        contactData,
        NotificationsConfig.urlNotificationsEmail,
      );

      // Email for new advisor
      content =
        `Hi ${data.newAdviser?.firstName} ${data.newAdviser?.firstLastname}, <br /> ` +
        `A request has been reassigned to you` +
        `<br/ ><br/ > >> Request Data << ` +
        `<br/ > Request ID: ${data.request?.id}` +
        `<br/ > Client ID: ${data.request.clientId}` +
        `<br/ > Old Adviser ID: ${data.originalAdviser?.id}` +
        `<br/ > Old Adviser Name: ${data.originalAdviser?.firstName} ${data.originalAdviser?.firstLastname}`;
      contactData = {
        destinyEmail: data.adviser.email,
        destinyName: data.adviser.firstName,
        emailSubject: NotificationsConfig.emailSubjectAdviserChange,
        emailBody: content,
      };

      this.sendNotification(
        contactData,
        NotificationsConfig.urlNotificationsEmail,
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /**
   * Method to send email when a response to a request is given
   * @param data
   * @returns
   */
  emailRequestResponse(data: any): Boolean {
    try {
      let content =
        `<br>Hi ${data.client?.firstName} ${data.client?.firstLastname} <br><br> ` +
        `Status of your request: ${data.status?.name}<br> <br><br> ` +
        `<p/>${data.comment}<p/>`;

      let contactData = {
        destinyEmail: data.client?.email,
        destinyName: `${data.client?.firstName} ${data.client?.firstLastname}`,
        emailSubject: NotificationsConfig.emailSubjectRequestResponse,
        emailBody: content,
      };

      this.sendNotification(
        contactData,
        NotificationsConfig.urlNotificationsEmail,
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /**
   * Method to send an email to the creator adviser when you want to rent or sell a property
   * @param data
   * @returns Boolean
   */
  async emailPublicForm(data: any): Promise<boolean> {
    try {
      let systemVariables: GeneralSystemVariables[] =
        await this.variablesRepository.find();
      if ((await systemVariables).length == 0) {
        throw new HttpErrors[500]('No system variables to perform the process');
      }
      let creatorAdviserEmail = data.systemVariables[0].creatorAdviserEmail;
      let creatorAdviserName = data.systemVariables[0].creatorAdviserName;
      let subject = 'Contact from the website';
      let content = `Hi ${creatorAdviserName}, <br /> A contact message has been received from the website. The information is:<br /><br />
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
        destinyEmail: creatorAdviserEmail,
        destinyName: creatorAdviserName,
        emailSubject: subject,
        emailBody: content,
      };
      let sent = this.sendNotification(
        contactData,
        NotificationsConfig.urlNotifications2FA,
      );
      return sent;
    } catch (err) {
      throw new HttpErrors[500]('Server error when sending message');
      return false;
    }
  }

  /**
   * Create random text with n characters
   * @param n password length
   * @returns random password with n characters
   */
  createHash(n: number): string {
    let password = generator.generate({
      length: n,
      numbers: true,
    });
    return password;
  }
}
