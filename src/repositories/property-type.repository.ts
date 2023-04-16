import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Property, PropertyType, PropertyTypeRelations} from '../models';
import {PropertyRepository} from './property.repository';

export class PropertyTypeRepository extends DefaultCrudRepository<
  PropertyType,
  typeof PropertyType.prototype.id,
  PropertyTypeRelations
> {
  public readonly properties: HasManyRepositoryFactory<
    Property,
    typeof PropertyType.prototype.id
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('PropertyRepository')
    protected propertyRepositoryGetter: Getter<PropertyRepository>,
  ) {
    super(PropertyType, dataSource);
    this.properties = this.createHasManyRepositoryFactoryFor(
      'properties',
      propertyRepositoryGetter,
    );
    this.registerInclusionResolver(
      'properties',
      this.properties.inclusionResolver,
    );
  }
}
