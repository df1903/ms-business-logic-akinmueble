import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {NotificationsConfig} from '../config/notifications.config';
import {GeneralSystemVariablesRepository} from '../repositories';

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
   */
  emailRequestResponse(data: any) {
    let content = `Hi ${data.firstName}  ${data.firstLastname}, <br />
    Your application to be an adviser for our company Akinmueble has been rejected`;
    let contactData = {
      destinyEmail: data.email,
      destinyName: `${data.firstName}  ${data?.firstLastname}`,
      emailSubject: NotificationsConfig.emailSubjectAdviserSignUpResponse,
      emailBody: content,
    };
    this.sendNotification(
      contactData,
      NotificationsConfig.urlNotificationsEmail,
    );
  }
  async emailNewAdviserSignUp(data: any) {
    try {
      // Get admin contact details
      let systemVariables = await this.variablesRepository.findOne({
        where: {
          id: 1,
        },
      });

      let content = `Hi ${systemVariables?.administratorName}, <br />A new adviser registration request has been received. The information is:
      <br /><br />
      Name: ${data.firstName} ${data.firstLastname}<br />
      Document: ${data.document}<br />
      Email: ${data.email}<br />
      Phone: ${data.phone}<br />
      Message type: Request for new adviser
      `;
      let contactData = {
        destinyEmail: systemVariables?.administratorEmail,
        destinyName: systemVariables?.administratorName,
        emailSubject: NotificationsConfig.emailSubjectNewAdviserSignUp,
        emailBody: content,
      };
      let sent = this.sendNotification(
        contactData,
        NotificationsConfig.urlNotificationsEmail,
      );
      return sent;
    } catch (err) {
      return false;
    }
  }
  /**
   * Method to email the administrator when you want to rent or sell a property
   * @param data
   * @returns Boolean
   */
  async emailPublicForm(data: any): Promise<boolean> {
    try {
      // Get admin contact details
      let systemVariables = await this.variablesRepository.findOne({
        where: {
          id: 1,
        },
      });
      if (!systemVariables) {
        throw new HttpErrors[500]('No system variables to perform the process');
      }

      let subject = 'Contact from the website';
      let content = `Hi ${systemVariables.administratorName}, <br /> A contact message has been received from the website. The information is:<br /><br />
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
        destinyEmail: systemVariables.administratorEmail,
        destinyName: systemVariables.administratorName,
        emailSubject: subject,
        emailBody: content,
      };
      let sent = this.sendNotification(
        contactData,
        NotificationsConfig.urlNotifications2FA,
      );
      return sent;
    } catch (err) {
      return false;
    }
  }
}
