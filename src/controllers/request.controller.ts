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
import {
  ChangeAdviser,
  ChangeInStudy,
  Request,
  RequestsByAdviserDate,
  RequestsByAdviserRequestStatus,
  ResponseRequest,
} from '../models';
import {
  AdviserRepository,
  ClientRepository,
  PropertyRepository,
  RequestRepository,
  RequestStatusRepository,
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
    @repository(RequestStatusRepository)
    public requestStatusRepository: RequestTypeRepository,
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
  @get('/request-by-adviser-date')
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

  /**
   * Get list of requests from an advisor
   * @param adviserId
   * @param requestStatusId
   * @returns Advisor request list
   */
  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.listAction],
  })
  @get('/request-by-adviser-requestStatus')
  @response(200, {
    description: 'Array of advisor request model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Request, {includeRelations: true}),
        },
      },
    },
  })
  async findByAdviserRequestStatus(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestsByAdviserRequestStatus),
        },
      },
    })
    data: RequestsByAdviserRequestStatus,
  ): Promise<Request[]> {
    // Returns the requests that match the advisor id and the request status id
    return this.requestRepository.find({
      where: {
        adviserId: data.adviserId,
        requestStatusId: data.requestStatusId,
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

  /**
   * Change a request to in study
   * @param requestId
   * @returns Request
   */
  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.createAction],
  })
  @post('/change-in-study')
  @response(204, {
    description: 'Request changes to in study',
    content: {'application/json': {schema: getModelSchemaRef(Request)}},
  })
  async changeInStudy(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChangeInStudy),
        },
      },
    })
    data: ChangeInStudy,
  ): Promise<Request | null> {
    // The request is obtained
    let request = await this.requestRepository.findOne({
      where: {
        id: data.requestId,
      },
    });

    // The request exists its status is changed
    if (request) {
      request!.requestStatusId = 2;
      await this.requestRepository.updateById(data.requestId, request);
      return request;
    }
    return null;
  }

  /**
   *
   * @param requestId
   * @param comment
   * @param requestStatusId
   * @returns
   */
  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.createAction],
  })
  @post('/response-request')
  @response(204, {
    description: 'Request answered',
    content: {'application/json': {schema: getModelSchemaRef(Request)}},
  })
  async responseRequest(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ResponseRequest),
        },
      },
    })
    data: ResponseRequest,
  ): Promise<Request | null> {
    // The request that will be answered is obtained
    let request = await this.requestRepository.findOne({
      where: {
        id: data.requestId,
      },
    });

    // If the request was found, it will be answered
    if (request) {
      // The request is updated
      request.requestStatusId = data.requestStatusId;
      request.comment = data.comment;
      await this.requestRepository.updateById(data.requestId, request);

      let client = await this.clientRepository.findOne({
        where: {
          id: request.clientId,
        },
      });

      let status = await this.requestStatusRepository.findOne({
        where: {
          id: request.requestStatusId,
        },
      });
      let contactData;
      let content;

      // If the request was rejected
      if (data.requestStatusId == 3) {
        // Notify that the request was rejected
        content =
          `<br>Hi ${client?.firstName} ${client?.firstLastname} <br><br> ` +
          `Status of your request: ${status?.name}<br> <br><br> ` +
          `<p/>${data.comment}<p/>`;

        contactData = {
          destinyEmail: client?.email,
          destinyName: `${client?.firstName} ${client?.firstLastname}`,
          emailSubject: 'Request response',
          emailBody: content,
        };

        this.notificationService.sendNotification(
          contactData,
          GeneralConfig.urlNotificationsEmail,
        );
        return request;
      }
      // If the request was accepted
      if (data.requestStatusId == 4 || data.requestStatusId == 5) {
        // Notify that the request was accepted
        let content =
          `<br>Hi ${client?.firstName} ${client?.firstLastname} <br><br> ` +
          `Status of your request: ${status?.name}<br> <br><br> ` +
          `<p/>${data.comment}<p/>`;

        contactData = {
          destinyEmail: client?.email,
          destinyName: `${client?.firstName} ${client?.firstLastname}`,
          emailSubject: 'Request response',
          emailBody: content,
        };

        this.notificationService.sendNotification(
          contactData,
          GeneralConfig.urlNotificationsEmail,
        );

        // Gets the other requests that the property has
        let requests = await this.requestRepository.find({
          where: {
            or: [
              {propertyId: request.propertyId, requestStatusId: 1},
              {propertyId: request.propertyId, requestStatusId: 2},
            ],
          },
          include: [{relation: 'client'}],
        });

        // Other requests that the property has are rejected
        this.propertyRepository.requests(request.propertyId).patch(
          {
            comment: '',
            requestStatusId: 3,
          },
          {
            or: [
              {
                requestStatusId: 1,
              },
              {
                requestStatusId: 2,
              },
            ],
          },
        );

        status = await this.requestStatusRepository.findOne({
          where: {
            id: 3,
          },
        });

        // Other clients are notified that their request was rejected
        for (const req of requests) {
          client = await this.clientRepository.findOne({
            where: {
              id: req.clientId,
            },
          });
          content =
            `<br>Hi ${client!.firstName}. ${client!.firstLastname} <br><br> ` +
            `Status of your request: ${status?.name}<br> <br><br> ` +
            `<p/>${'Your request was rejected because another one was already accepted. We invite you to look at other properties of your interest'}<p/>`;
          contactData = {
            destinyEmail: client?.email,
            destinyName: `${client?.firstName} ${client?.firstLastname} ${client?.firstLastname}`,
            emailSubject: 'Request response',
            emailBody: content,
          };
          this.notificationService.sendNotification(
            contactData,
            GeneralConfig.urlNotificationsEmail,
          );
        }
        return request;
      }

      return request;
    }
    return null;
  }
}
