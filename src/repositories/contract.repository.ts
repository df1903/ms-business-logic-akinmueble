import { Getter, inject } from '@loopback/core';
import { DefaultCrudRepository, HasOneRepositoryFactory, repository } from '@loopback/repository';
import { MysqlDataSource } from '../datasources';
import { Contract, ContractRelations, Request } from '../models';
import { RequestRepository } from './request.repository';

export class ContractRepository extends DefaultCrudRepository<
  Contract,
  typeof Contract.prototype.id,
  ContractRelations
> {

  public readonly request: HasOneRepositoryFactory<Request, typeof Contract.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>,
  ) {
    super(Contract, dataSource);
    this.request = this.createHasOneRepositoryFactoryFor('request', requestRepositoryGetter);
    this.registerInclusionResolver('request', this.request.inclusionResolver);
  }
}
