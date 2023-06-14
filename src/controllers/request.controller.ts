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
import {
  AssignToRequest,
  ChangeStatusOfRequest,
  ClientRequest,
  Request,
  RequestsByAdviserDate,
} from '../models';
import {
  AdviserRepository,
  ClientRepository,
  ContractRepository,
  GuarantorRepository,
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
    @repository(GuarantorRepository)
    public guarantorRepository: GuarantorRepository,
    @repository(ContractRepository)
    public contractRepository: ContractRepository,
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
  async find(@param.filter(Request) filter?: Filter<Request>): Promise<Object> {
    let total = (await this.requestRepository.count()).count;
    let records = await this.requestRepository.find(filter);
    let res = {
      records: records,
      total: total,
    };
    return res;
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
          schema: getModelSchemaRef(ClientRequest),
        },
      },
    })
    data: ClientRequest,
  ): Promise<Boolean> {
    let request = await this.requestRepository.findOne({
      where: {
        id: data.requestId,
        clientId: data.clientId,
      },
    });
    if (request) {
      if (request.requestStatusId == GeneralConfig.Sent) {
        await this.requestRepository.deleteById(data.requestId);
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
  @post('/change-status-of-request')
  @response(204, {
    description: 'Request changes to in study',
    content: {'application/json': {schema: getModelSchemaRef(Request)}},
  })
  async changeStatusOfRequest(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChangeStatusOfRequest),
        },
      },
    })
    data: ChangeStatusOfRequest,
  ): Promise<Request | null> {
    try {
      // The request is obtained
      let request = await this.requestRepository.findOne({
        where: {
          id: data.requestId,
        },
      });

      // The request exists its status is changed
      if (request) {
        if (
          data.status != GeneralConfig.InStudy &&
          data.status != GeneralConfig.Sent &&
          data.status != GeneralConfig.Cancelled
        ) {
          // The  client is obtained
          let client = await this.clientRepository.findOne({
            where: {
              id: request.clientId,
            },
          });
          // notify client
          let info = {
            name: `${client?.firstName}  ${client?.firstLastname}`,
            comment: data.comment,
            status: data.status,
            email: client?.email,
            phone: client?.phone,
          };
          this.notificationService.emailPropertyRequestResponse(info);
        }

        // Change request status
        request.requestStatusId = data.status;

        if (
          request.requestStatusId == GeneralConfig.Accepted ||
          request.requestStatusId == GeneralConfig.AcceptedWithGuarantor
        ) {
          request.contractId = 1;
        }

        // Update status
        await this.requestRepository.updateById(data.requestId, request);

        return request;
      }
    } catch {}
    return null;
  }

  // Assign guarantor
  @post('/assign-guarantor')
  @response(204, {
    description: 'Assign guarantor to a request',
  })
  async assignGuarantor(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AssignToRequest),
        },
      },
    })
    data: AssignToRequest,
  ): Promise<boolean> {
    let guarantor = await this.guarantorRepository.findOne({
      where: {
        id: data.id,
      },
    });
    let request = await this.requestRepository.findOne({
      where: {
        id: data.requestId,
      },
    });
    if (guarantor && request) {
      request.guarantorId = data.id;
      request.requestStatusId = GeneralConfig.Accepted;
      this.requestRepository.replaceById(data.requestId, request);
      return true;
    }
    return false;
  }

  // assing contract
  // Assign guarantor
  @post('/assign-contract')
  @response(204, {
    description: 'Assign contract to a request',
  })
  async assignContract(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AssignToRequest),
        },
      },
    })
    data: AssignToRequest,
  ): Promise<boolean> {
    let contract = await this.contractRepository.findOne({
      where: {
        id: data.id,
      },
    });
    let request = await this.requestRepository.findOne({
      where: {
        id: data.requestId,
      },
    });
    if (contract && request) {
      request.contractId = data.id;

      this.requestRepository.replaceById(data.requestId, request);

      // Gets the other requests that the property has
      let requests = await this.requestRepository.find({
        where: {
          or: [
            {propertyId: request.propertyId, requestStatusId: 1},
            {propertyId: request.propertyId, requestStatusId: 2},
          ],
        },
      });

      // Other requests that the property has are rejected
      this.propertyRepository.requests(request.propertyId).patch(
        {
          comment:
            'Your request was rejected because one was already accepted previously. We invite you to look at one that interests you.',
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

      // Other clients are notified that their request was rejected
      let info = {
        name: '',
        comment:
          'Your request was rejected because one was already accepted previously. We invite you to look at one that interests you.',
        status: GeneralConfig.Rejected,
        email: '',
        phone: '',
      };
      for (const req of requests) {
        let client = await this.clientRepository.findOne({
          where: {
            id: req.clientId,
          },
        });
        if (client) {
          info.name = `${client?.firstName}  ${client?.firstLastname}`;
          info.email = client?.email;
          (info.phone = client?.phone),
            this.notificationService.emailPropertyRequestResponse(info);
        }
      }

      return true;
    }
    return false;
  }
}
