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
import {Client, ClientValidationHash} from '../models';
import {ClientRepository} from '../repositories';
import {NotificationsService, SecurityService} from '../services';

export class ClientController {
  constructor(
    @repository(ClientRepository)
    public clientRepository: ClientRepository,
    @service(NotificationsService)
    private notificationService: NotificationsService,
    @service(SecurityService)
    private securityService: SecurityService,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.createAction],
  })
  @post('/client')
  @response(200, {
    description: 'Client model instance',
    content: {'application/json': {schema: getModelSchemaRef(Client)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {
            title: 'NewClient',
            exclude: ['id'],
          }),
        },
      },
    })
    client: Omit<Client, 'id'>,
  ): Promise<Client> {
    return this.clientRepository.create(client);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.listAction],
  })
  @get('/client/count')
  @response(200, {
    description: 'Client model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Client) where?: Where<Client>): Promise<Count> {
    return this.clientRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.listAction],
  })
  @get('/client')
  @response(200, {
    description: 'Array of Client model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Client, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Client) filter?: Filter<Client>): Promise<Client[]> {
    return this.clientRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.editAction],
  })
  @patch('/client')
  @response(200, {
    description: 'Client PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {partial: true}),
        },
      },
    })
    client: Client,
    @param.where(Client) where?: Where<Client>,
  ): Promise<Count> {
    return this.clientRepository.updateAll(client, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.listAction],
  })
  @get('/client/{id}')
  @response(200, {
    description: 'Client model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Client, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Client, {exclude: 'where'})
    filter?: FilterExcludingWhere<Client>,
  ): Promise<Client> {
    return this.clientRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.editAction],
  })
  @patch('/client/{id}')
  @response(204, {
    description: 'Client PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {partial: true}),
        },
      },
    })
    client: Client,
  ): Promise<void> {
    await this.clientRepository.updateById(id, client);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.editAction],
  })
  @put('/client/{id}')
  @response(204, {
    description: 'Client PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() client: Client,
  ): Promise<void> {
    await this.clientRepository.replaceById(id, client);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuClientId, SecurityConfig.deleteAction],
  })
  @del('/client/{id}')
  @response(204, {
    description: 'Client DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.clientRepository.deleteById(id);
  }

  /**
   * CUSTOM METHODS
   */

  /**
   * Client sign up
   * @param client
   * @returns client created or null Email already registered
   */
  @post('/client-sign-up')
  @response(200, {
    description: 'Client model instance',
    content: {'application/json': {schema: getModelSchemaRef(Client)}},
  })
  async clientSignUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {
            title: 'NewClient',
            exclude: ['id'],
          }),
        },
      },
    })
    client: Omit<Client, 'id'>,
  ): Promise<Client | undefined> {
    // Verify if the email is already registered
    let emailExists = await this.clientRepository.findOne({
      where: {
        email: client.email,
      },
    });

    try {
      if (emailExists != null) {
        throw new HttpErrors[400]('Email already registered');
      }

      // Client invalid at the moment
      client.validatedEmail = false;

      // Generate and send hash code to validate the mail
      let hash = this.securityService.createHash(100);
      client.hashCode = hash;

      // Send verification email
      let link = `<a href="${NotificationsConfig.urlFrontHashVerification}/${hash}" target="_blank"> VALIDATE </a>`;
      let data = {
        destinyEmail: client.email,
        destinyName: `${client.firstName} ${client.firstLastname}`,
        emailBody:
          `Click on the following link to verify your email <br/ > <br/ >` +
          `<br/ >${link}`,
        emailSubject: NotificationsConfig.emailSubjectVerificateEmail,
      };

      let url = NotificationsConfig.urlNotifications2FA;
      this.notificationService.sendNotification(data, url);

      // Create client
      return this.clientRepository.create(client);
    } catch (err) {
      err;
    }
    return undefined;
  }

  @post('/validate-client-hash')
  @response(200, {
    description: 'Validated hash',
  })
  async validateClientHash(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ClientValidationHash, {}),
        },
      },
    })
    hash: ClientValidationHash,
  ): Promise<boolean> {
    let client = await this.clientRepository.findOne({
      where: {
        hashCode: hash.hashCode,
        validatedEmail: false,
      },
    });
    if (client) {
      client.validatedEmail = true;
      this.clientRepository.replaceById(client.id, client);
      this.securityService.createClient(client);
      return true;
    }
    return false;
  }
}
