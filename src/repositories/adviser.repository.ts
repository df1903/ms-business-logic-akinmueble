import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Adviser, AdviserRelations, Request} from '../models';
import {RequestRepository} from './request.repository';

export class AdviserRepository extends DefaultCrudRepository<
  Adviser,
  typeof Adviser.prototype.id,
  AdviserRelations
> {

  public readonly requests: HasManyRepositoryFactory<Request, typeof Adviser.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>,
  ) {
    super(Adviser, dataSource);
    this.requests = this.createHasManyRepositoryFactoryFor('requests', requestRepositoryGetter,);
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);
  }
}
