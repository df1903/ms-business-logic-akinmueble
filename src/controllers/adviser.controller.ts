import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
  Request,
  RestBindings,
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import parseBearerToken from 'parse-bearer-token';
import {SecurityConfig} from '../config/security.config';
import {Adviser, AdviserRequestResponse} from '../models';
import {
  AdviserRepository,
  GeneralSystemVariablesRepository,
} from '../repositories';
import {NotificationsService, SecurityService} from '../services';

export class AdviserController {
  constructor(
    @repository(AdviserRepository)
    public adviserRepository: AdviserRepository,
    @service(NotificationsService)
    private notificationService: NotificationsService,
    @repository(GeneralSystemVariablesRepository)
    private variablesRepository: GeneralSystemVariablesRepository,
    @service(SecurityService)
    private securityService: SecurityService,
    @inject(RestBindings.Http.REQUEST) private req: Request,
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
      // accepted = undefined =sent
      adviser.accepted = undefined;

      // Notify the administrator of a new request to adviser
      this.notificationService.emailNewAdviserSignUp(adviser);

      return this.adviserRepository.create(adviser);
    } catch (err) {
      return undefined;
    }
  }

  /**
   * Administrator's response to a request for a new adviser
   * @param response
   * @returns Boolean
   */
  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuAdviserId, SecurityConfig.createAction],
  })
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
  ): Promise<boolean> {
    try {
      // Obtain the applicant's data
      let adviser = await this.adviserRepository.findOne({
        where: {id: response.adviserId},
      });
      if (adviser) {
        if (!response.accepted) {
          // The advisor's request is rejected
          adviser.accepted = false;
          // Notify advisor requester
          this.notificationService.emailAdviserRequestResponse(adviser);
        } else {
          // The advisor's request is accepted
          adviser.accepted = true;
          // Create the logical user with credentials
          let token = parseBearerToken(this.req);
          if (token) {
            this.securityService.createAdvisor(adviser, token);
          }
        }
        this.adviserRepository.updateById(response.adviserId, adviser);
        return true;
      }
    } catch (err) {
      console.log('The request does not exist');
    }
    return false;
  }
}
