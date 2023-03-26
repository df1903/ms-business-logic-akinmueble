import { Getter, inject } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { MysqlDataSource } from '../datasources';
import { Property, TypeProperty, TypePropertyRelations } from '../models';
import { PropertyRepository } from './property.repository';

export class TypePropertyRepository extends DefaultCrudRepository<
  TypeProperty,
  typeof TypeProperty.prototype.id,
  TypePropertyRelations
> {

  public readonly properties: HasManyRepositoryFactory<Property, typeof TypeProperty.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>,
  ) {
    super(TypeProperty, dataSource);
    this.properties = this.createHasManyRepositoryFactoryFor('properties', propertyRepositoryGetter,);
    this.registerInclusionResolver('properties', this.properties.inclusionResolver);
  }
}