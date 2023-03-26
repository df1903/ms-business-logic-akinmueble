import { Getter, inject } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { MysqlDataSource } from '../datasources';
import { Guarantor, GuarantorRelations, Request } from '../models';
import { RequestRepository } from './request.repository';

export class GuarantorRepository extends DefaultCrudRepository<
  Guarantor,
  typeof Guarantor.prototype.id,
  GuarantorRelations
> {

  public readonly requests: HasManyRepositoryFactory<Request, typeof Guarantor.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>,
  ) {
    super(Guarantor, dataSource);
    this.requests = this.createHasManyRepositoryFactoryFor('requests', requestRepositoryGetter,);
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);
  }
}
