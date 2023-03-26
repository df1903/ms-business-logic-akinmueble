import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
import { MysqlDataSource } from '../datasources';
import { Photo, PhotoRelations, Property } from '../models';
import { PropertyRepository } from './property.repository';

export class PhotoRepository extends DefaultCrudRepository<
  Photo,
  typeof Photo.prototype.id,
  PhotoRelations
> {

  public readonly property: BelongsToAccessor<Property, typeof Photo.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>,
  ) {
    super(Photo, dataSource);
    this.property = this.createBelongsToAccessorFor('property', propertyRepositoryGetter,);
    this.registerInclusionResolver('property', this.property.inclusionResolver);
  }
}
