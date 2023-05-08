import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {NotificationsConfig} from '../config/notifications.config';
import {SecurityConfig} from '../config/security.config';
import {
  Adviser,
  AdviserRequestResponse,
  GeneralSystemVariables,
} from '../models';
import {
  AdviserRepository,
  GeneralSystemVariablesRepository,
} from '../repositories';
import {NotificationsService} from '../services';

export class AdviserController {
  constructor(
    @repository(AdviserRepository)
    public adviserRepository: AdviserRepository,
    @service(NotificationsService)
    private notificationService: NotificationsService,
    @repository(GeneralSystemVariablesRepository)
    private variablesRepository: GeneralSystemVariablesRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuAdviserId, SecurityConfig.createAction],
  })
  @post('/adviser')
  @response(200, {
    description: 'Adviser model instance',
    content: {'application/json': {schema: getModelSchemaRef(Adviser)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Adviser, {
            title: 'NewAdviser',
            exclude: ['id'],
          }),
        },
      },
    })
    adviser: Omit<Adviser, 'id'>,
  ): Promise<Adviser> {
    return this.adviserRepository.create(adviser);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuAdviserId, SecurityConfig.listAction],
  })
  @get('/adviser/count')
  @response(200, {
    description: 'Adviser model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Adviser) where?: Where<Adviser>): Promise<Count> {
    return this.adviserRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuAdviserId, SecurityConfig.listAction],
  })
  @get('/adviser')
  @response(200, {
    description: 'Array of Adviser model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Adviser, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Adviser) filter?: Filter<Adviser>,
  ): Promise<Adviser[]> {
    return this.adviserRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuAdviserId, SecurityConfig.editAction],
  })
  @patch('/adviser')
  @response(200, {
    description: 'Adviser PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Adviser, {partial: true}),
        },
      },
    })
    adviser: Adviser,
    @param.where(Adviser) where?: Where<Adviser>,
  ): Promise<Count> {
    return this.adviserRepository.updateAll(adviser, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuAdviserId, SecurityConfig.listAction],
  })
  @get('/adviser/{id}')
  @response(200, {
    description: 'Adviser model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Adviser, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Adviser, {exclude: 'where'})
    filter?: FilterExcludingWhere<Adviser>,
  ): Promise<Adviser> {
    return this.adviserRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuAdviserId, SecurityConfig.editAction],
  })
  @patch('/adviser/{id}')
  @response(204, {
    description: 'Adviser PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Adviser, {partial: true}),
        },
      },
    })
    adviser: Adviser,
  ): Promise<void> {
    await this.adviserRepository.updateById(id, adviser);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuAdviserId, SecurityConfig.editAction],
  })
  @put('/adviser/{id}')
  @response(204, {
    description: 'Adviser PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() adviser: Adviser,
  ): Promise<void> {
    await this.adviserRepository.replaceById(id, adviser);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuAdviserId, SecurityConfig.deleteAction],
  })
  @del('/adviser/{id}')
  @response(204, {
    description: 'Adviser DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.adviserRepository.deleteById(id);
  }

  /**
   * CUSTOM METHODS
   */

  /**
   * Adviser sign up
   * @param adviser
   * @returns advisor created or null Email already registered
   */
  @post('/advisor-sign-up')
  @response(200, {
    description: 'Adviser model instance',
    content: {'application/json': {schema: getModelSchemaRef(Adviser)}},
  })
  async advisorSignUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Adviser, {
            title: 'NewAdviser',
            exclude: ['id'],
          }),
        },
      },
    })
    adviser: Omit<Adviser, 'id'>,
  ): Promise<Adviser | undefined> {
    // Verify if the email is already registered
    let emailExists = await this.adviserRepository.findOne({
      where: {
        email: adviser.email,
      },
    });
    try {
      if (emailExists != null) {
        throw new HttpErrors[400]('Email already registered');
      }

      // Adviser invalid at the moment
      adviser.accepted = false;

      // Notify the administrator of a new request to adviser
      let systemVariables: GeneralSystemVariables[] =
        await this.variablesRepository.find();
      if ((await systemVariables).length == 0) {
        throw new HttpErrors[500]('No system variables to perform the process');
      }
      let administratorEmail = systemVariables[0].administratorEmail;
      let administratorName = systemVariables[0].administratorName;
      let subject = 'Application for the position of real estate advisor.';
      let content = `Hi ${administratorName}, <br /> A contact message has been received from the website. The information is:
      <br /><br />
      Name: ${adviser.firstName} ${adviser.secondName}<br />
      Document: ${adviser.document}<br />
      Email: ${adviser.email}<br />
      Phone: ${adviser.phone}<br />
      Message type: Request for new adviser
      `;
      let contactData = {
        destinyEmail: administratorEmail,
        destinyName: administratorName,
        emailSubject: subject,
        emailBody: content,
      };
      let sent = this.notificationService.sendNotification(
        contactData,
        NotificationsConfig.urlNotificationsEmail,
      );
      return this.adviserRepository.create(adviser);
    } catch (err) {
      err;
    }
    return undefined;
  }

  /**
   * Administrator's response to a request for a new adviser
   * @param response
   * @returns Request response
   */
  @post('/adviser-request-response')
  @response(200, {
    description: 'Adviser model instance',
    content: {'application/json': {schema: getModelSchemaRef(Adviser)}},
  })
  async AdviserRequestResponse(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AdviserRequestResponse),
        },
      },
    })
    response: AdviserRequestResponse,
  ): Promise<void | Boolean> {
    // Obtain the applicant's data
    let adviser = await this.adviserRepository.findOne({
      where: {id: response.adviserId},
    });
    if (adviser) {
      // The advisor's request is rejected
      if (!response.accepted) {
        // Notify
        let subject = 'Response: Adviser Application';
        let content = `Hi ${adviser?.firstName}  ${adviser?.firstLastname}, <br /> Your application to be an adviser for our company Akinmueble has been rejected`;
        let contactData = {
          destinyEmail: adviser?.email,
          destinyName: `${adviser?.firstName}  ${adviser?.firstLastname}`,
          emailSubject: subject,
          emailBody: content,
        };
        this.notificationService.sendNotification(
          contactData,
          NotificationsConfig.urlNotificationsEmail,
        );
        // Delete
        return await this.adviserRepository.deleteById(response.adviserId);
      }

      // The advisor's request is accepted
      adviser!.accepted = true;
      await this.adviserRepository.updateById(response.adviserId, adviser);

      // Method that connects and creates the advisor in ms-security as a user with advisor role. Also send the credentials by mail
    }
    console.log('The request does not exist');
  }
}
