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
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {GeneralConfig} from '../config/general.config';
import {SecurityConfig} from '../config/security.config';
import {ChangeAdviser, Request, RequestsByAdviserDate} from '../models';
import {
  AdviserRepository,
  ClientRepository,
  PropertyRepository,
  RequestRepository,
  RequestTypeRepository,
} from '../repositories';
import {NotificationsService} from '../services';

export class RequestController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
    @repository(RequestTypeRepository)
    public requestTypeRepository: RequestTypeRepository,
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
    @repository(AdviserRepository)
    public adviserRepository: AdviserRepository,
    @repository(ClientRepository)
    public clientRepository: ClientRepository,
    @service(NotificationsService)
    public notificationService: NotificationsService,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.createAction],
  })
  @post('/request')
  @response(200, {
    description: 'Request model instance',
    content: {'application/json': {schema: getModelSchemaRef(Request)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {
            title: 'NewRequest',
            exclude: ['id'],
          }),
        },
      },
    })
    request: Omit<Request, 'id'>,
  ): Promise<Request> {
    //method to notify the adviser in charge about the request for their property
    let property = await this.propertyRepository.findOne({
      where: {id: request.propertyId},
    });
    if (property) {
      let adviser = await this.adviserRepository.findOne({
        where: {id: property.adviserId},
      });
      if (adviser) {
        request.adviserId = adviser.getId();
        let client = await this.clientRepository.findOne({
          where: {id: request.clientId},
        });
        if (client) {
          let subject = 'New real estate request';
          let type = await this.requestTypeRepository.findOne({
            where: {id: request.requestTypeId},
          });
          let price = 0.0;
          if (request.requestTypeId == 1) {
            price = property.salePrice;
          } else {
            price = property.rentalPrice;
          }
          let content =
            `The client ${client?.firstName} has made a request to your property ` +
            `<br/ ><br/ > >> Applicant's Data << ` +
            `<br/ > Document: ${client?.document}` +
            `<br/ > Name: ${client?.firstName}` +
            `<br/ > Lastame: ${client?.firstLastname}` +
            `<br/ > Email: ${client?.email}` +
            `<br/ > Phone: ${client?.phone}` +
            `<br/ > Type Request: ${type?.name}` +
            `<br/ > Price: $${price}`;

          let data = {
            destinyEmail: adviser.email,
            destinyName: adviser.firstName,
            emailSubject: subject,
            emailBody: content,
          };
          let url = GeneralConfig.urlNotificationsEmail;
          this.notificationService.sendNotification(data, url);
        }
      }
    }
    return this.requestRepository.create(request);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.listAction],
  })
  @get('/request/count')
  @response(200, {
    description: 'Request model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Request) where?: Where<Request>): Promise<Count> {
    return this.requestRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.listAction],
  })
  @get('/request')
  @response(200, {
    description: 'Array of Request model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Request, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Request) filter?: Filter<Request>,
  ): Promise<Request[]> {
    return this.requestRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.editAction],
  })
  @patch('/request')
  @response(200, {
    description: 'Request PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {partial: true}),
        },
      },
    })
    request: Request,
    @param.where(Request) where?: Where<Request>,
  ): Promise<Count> {
    return this.requestRepository.updateAll(request, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.listAction],
  })
  @get('/request/{id}')
  @response(200, {
    description: 'Request model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Request, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Request, {exclude: 'where'})
    filter?: FilterExcludingWhere<Request>,
  ): Promise<Request> {
    return this.requestRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.editAction],
  })
  @patch('/request/{id}')
  @response(204, {
    description: 'Request PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {partial: true}),
        },
      },
    })
    request: Request,
  ): Promise<void> {
    await this.requestRepository.updateById(id, request);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.editAction],
  })
  @put('/request/{id}')
  @response(204, {
    description: 'Request PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() request: Request,
  ): Promise<void> {
    await this.requestRepository.replaceById(id, request);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.deleteAction],
  })
  @del('/request/{id}')
  @response(204, {
    description: 'Request DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.requestRepository.deleteById(id);
  }

  /**
   * CUSTOM METHODS
   */

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.listAction],
  })
  @get('/request-by-adviser')
  @response(200, {
    description: 'Array of Request model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Request, {includeRelations: true}),
        },
      },
    },
  })
  async findByAdviserAndDate(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestsByAdviserDate),
        },
      },
    })
    data: RequestsByAdviserDate,
  ): Promise<Request[]> {
    return this.requestRepository.find({
      where: {
        adviserId: data.adviserId,
        date: {
          between: [data.startDate, data.endDate],
        },
        requestTypeId: 2,
      },
      include: [{relation: 'property'}],
    });
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.createAction],
  })
  @post('/change-adviser')
  @response(204, {
    description: 'Adviser Change successfully',
    content: {'application/json': {schema: getModelSchemaRef(Request)}},
  })
  async changeAdviser(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChangeAdviser),
        },
      },
    })
    data: ChangeAdviser,
  ): Promise<Request | null> {
    let request = await this.requestRepository.findOne({
      where: {
        id: data.requestId,
      },
    });
    if (request) {
      let adviser = await this.adviserRepository.findOne({
        where: {
          id: data.adviserId,
        },
      });
      let adviserOriginal = await this.adviserRepository.findOne({
        where: {
          id: request.adviserId,
        },
      });
      if (adviser) {
        let subject = 'Alert: Adviser Changed';
        let content =
          `Hi ${adviserOriginal?.firstName}, <br /> ` +
          `The request you were in charge of has been reassigned` +
          `<br/ ><br/ > >> Request Data << ` +
          `<br/ > Request ID: ${request?.id}` +
          `<br/ > Client ID: ${request.clientId}` +
          `<br/ > New Adviser ID: ${adviser.id}` +
          `<br/ > New Adviser Name: ${adviser.firstName} ${adviser.firstLastname}`;
        let contactData = {
          destinyEmail: adviserOriginal?.email,
          destinyName: adviserOriginal?.firstName,
          emailSubject: subject,
          emailBody: content,
        };
        let sent = this.notificationService.sendNotification(
          contactData,
          GeneralConfig.urlNotificationsEmail,
        );
        subject = 'Alert: Adviser Changed';
        content =
          `Hi ${adviser?.firstName}, <br /> ` +
          `A request has been reassigned to you` +
          `<br/ ><br/ > >> Request Data << ` +
          `<br/ > Request ID: ${request?.id}` +
          `<br/ > Client ID: ${request.clientId}` +
          `<br/ > Old Adviser ID: ${adviserOriginal?.id}` +
          `<br/ > Old Adviser Name: ${adviserOriginal?.firstName} ${adviserOriginal?.firstLastname}`;
        contactData = {
          destinyEmail: adviser.email,
          destinyName: adviser.firstName,
          emailSubject: subject,
          emailBody: content,
        };
        sent = this.notificationService.sendNotification(
          contactData,
          GeneralConfig.urlNotificationsEmail,
        );
        await this.requestRepository.updateById(data.requestId, data);
        return request;
      }
    }
    return null;
  }
}
