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
import {NotificationsConfig} from '../config/notifications.config';
import {SecurityConfig} from '../config/security.config';
import {Client, Request, RequestsByAdviserDate} from '../models';
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
          if (request.requestTypeId == GeneralConfig.sale) {
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
          let url = NotificationsConfig.urlNotificationsEmail;
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

  /**
   * Get accepted request for an adviser in a time range
   * @param RequestsByAdviserDate
   * @returns Request[]>
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
        requestStatusId: GeneralConfig.Accepted,
      },
      include: [{relation: 'property'}],
    });
  }

  /**
   * Get list of requests from an advisor
   * @param adviserId
   * @param Request
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
          schema: getModelSchemaRef(Request),
        },
      },
    })
    data: Request,
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

  /**
   * Get list of requests from a client
   * @param data
   * @returns Client request list
   */
  @get('/request-by-client')
  @response(200, {
    description: 'Array of client request model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Request, {includeRelations: false}),
        },
      },
    },
  })
  async findByClientRequest(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client),
        },
      },
    })
    data: Client,
  ): Promise<Request[]> {
    return this.requestRepository.find({
      where: {
        clientId: data.id,
      },
    });
  }

  /**
   * Cancel request from a client when it is in sent
   * @param Request
   * @returns Boolean
   */
  @post('/cancel-client-request')
  @response(204, {
    description: 'successfully canceled',
    content: {'application/json': {schema: getModelSchemaRef(Request)}},
  })
  async cancelClientRequest(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request),
        },
      },
    })
    data: Request,
  ): Promise<Boolean> {
    let request = await this.requestRepository.findOne({
      where: {
        id: data.id,
        clientId: data.clientId,
      },
    });
    if (request) {
      if (request.requestStatusId == GeneralConfig.Sent) {
        await this.requestRepository.deleteById(data.id);
        return true;
      }
    }

    return false;
  }

  /**
   * Changes the adviser of a request and notifies them
   * @param Request
   * @returns Request
   */
  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuRequestId, SecurityConfig.createAction],
  })
  @post('/adviser-change')
  @response(204, {
    description: 'Adviser Change successfully',
    content: {'application/json': {schema: getModelSchemaRef(Request)}},
  })
  async AdviserChange(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request),
        },
      },
    })
    data: Request,
  ): Promise<Request | null> {
    let request = await this.requestRepository.findOne({
      where: {
        id: data.id,
      },
    });
    if (request) {
      let newAdviser = await this.adviserRepository.findOne({
        where: {
          id: data.adviserId,
        },
      });
      let originalAdviser = await this.adviserRepository.findOne({
        where: {
          id: request.adviserId,
        },
      });

      if (newAdviser && originalAdviser) {
        request.adviserId = data.adviserId;

        let info = {
          request: request,
          newAdviser: newAdviser,
          originalAdviser: originalAdviser,
        };
        this.notificationService.emailAdviserChange(info);

        await this.requestRepository.updateById(data.id, request);
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
          schema: getModelSchemaRef(Request),
        },
      },
    })
    data: Request,
  ): Promise<Request | null> {
    // The request is obtained
    let request = await this.requestRepository.findOne({
      where: {
        id: data.id,
      },
    });

    // The request exists its status is changed
    if (request) {
      request!.requestStatusId = GeneralConfig.InStudy;
      await this.requestRepository.updateById(data.id, request);
      return request;
    }
    return null;
  }

  /**
   *
   * @param requestId
   * @param comment
   * @param requestStatusId
   * @returns request
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
          schema: getModelSchemaRef(Request),
        },
      },
    })
    data: Request,
  ): Promise<Request | null> {
    // The request that will be answered is obtained
    let request = await this.requestRepository.findOne({
      where: {
        id: data.id,
      },
    });

    // If the request was found, it will be answered
    if (request) {
      // The request is updated
      request.requestStatusId = data.requestStatusId;
      request.comment = data.comment;
      await this.requestRepository.updateById(data.id, request);

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

      // Notify response to the request
      let info = {
        client: client,
        status: status,
        comment: data.comment,
      };

      this.notificationService.emailRequestResponse(info);

      // Contrato
      return request;
    }
    return null;
  }

  //crear codeodor
  //crear contrato
}
