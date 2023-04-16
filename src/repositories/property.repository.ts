import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {
  City,
  Photo,
  Property,
  PropertyRelations,
  PropertyType,
  Request,
} from '../models';
import {CityRepository} from './city.repository';
import {PhotoRepository} from './photo.repository';
import {PropertyTypeRepository} from './property-type.repository';
import {RequestRepository} from './request.repository';

export class PropertyRepository extends DefaultCrudRepository<
  Property,
  typeof Property.prototype.id,
  PropertyRelations
> {
  public readonly propertyType: BelongsToAccessor<
    PropertyType,
    typeof Property.prototype.id
  >;

  public readonly photos: HasManyRepositoryFactory<
    Photo,
    typeof Property.prototype.id
  >;

  public readonly city: BelongsToAccessor<City, typeof Property.prototype.id>;

  public readonly requests: HasManyRepositoryFactory<
    Request,
    typeof Property.prototype.id
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('PropertyTypeRepository')
    protected propertyTypeRepositoryGetter: Getter<PropertyTypeRepository>,
    @repository.getter('PhotoRepository')
    protected photoRepositoryGetter: Getter<PhotoRepository>,
    @repository.getter('CityRepository')
    protected cityRepositoryGetter: Getter<CityRepository>,
    @repository.getter('RequestRepository')
    protected requestRepositoryGetter: Getter<RequestRepository>,
  ) {
    super(Property, dataSource);
    this.requests = this.createHasManyRepositoryFactoryFor(
      'requests',
      requestRepositoryGetter,
    );
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);

    this.city = this.createBelongsToAccessorFor('city', cityRepositoryGetter);
    this.registerInclusionResolver('city', this.city.inclusionResolver);
    this.photos = this.createHasManyRepositoryFactoryFor(
      'photos',
      photoRepositoryGetter,
    );
    this.registerInclusionResolver('photos', this.photos.inclusionResolver);
    this.propertyType = this.createBelongsToAccessorFor(
      'propertyType',
      propertyTypeRepositoryGetter,
    );
    this.registerInclusionResolver(
      'propertyType',
      this.propertyType.inclusionResolver,
    );
  }
}
