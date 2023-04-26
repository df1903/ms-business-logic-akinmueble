import { Getter, inject } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { MysqlDataSource } from '../datasources';
import { Adviser, AdviserRelations, Request, Property} from '../models';
import { RequestRepository } from './request.repository';
import {PropertyRepository} from './property.repository';

export class AdviserRepository extends DefaultCrudRepository<
  Adviser,
  typeof Adviser.prototype.id,
  AdviserRelations
> {

  public readonly requests: HasManyRepositoryFactory<Request, typeof Adviser.prototype.id>;

  public readonly properties: HasManyRepositoryFactory<Property, typeof Adviser.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>,
  ) {
    super(Adviser, dataSource);
    this.properties = this.createHasManyRepositoryFactoryFor('properties', propertyRepositoryGetter,);
    this.registerInclusionResolver('properties', this.properties.inclusionResolver);
    this.requests = this.createHasManyRepositoryFactoryFor('requests', requestRepositoryGetter,);
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);
  }
}
