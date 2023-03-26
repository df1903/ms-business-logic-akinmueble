import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Request, RequestRelations, Adviser, Client, Contract, Guarantor, Property} from '../models';
import {AdviserRepository} from './adviser.repository';
import {ClientRepository} from './client.repository';
import {ContractRepository} from './contract.repository';
import {GuarantorRepository} from './guarantor.repository';
import {PropertyRepository} from './property.repository';

export class RequestRepository extends DefaultCrudRepository<
  Request,
  typeof Request.prototype.id,
  RequestRelations
> {

  public readonly adviser: BelongsToAccessor<Adviser, typeof Request.prototype.id>;

  public readonly client: BelongsToAccessor<Client, typeof Request.prototype.id>;

  public readonly contract: BelongsToAccessor<Contract, typeof Request.prototype.id>;

  public readonly guarantor: BelongsToAccessor<Guarantor, typeof Request.prototype.id>;

  public readonly property: BelongsToAccessor<Property, typeof Request.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('AdviserRepository') protected adviserRepositoryGetter: Getter<AdviserRepository>, @repository.getter('ClientRepository') protected clientRepositoryGetter: Getter<ClientRepository>, @repository.getter('ContractRepository') protected contractRepositoryGetter: Getter<ContractRepository>, @repository.getter('GuarantorRepository') protected guarantorRepositoryGetter: Getter<GuarantorRepository>, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>,
  ) {
    super(Request, dataSource);
    this.property = this.createBelongsToAccessorFor('property', propertyRepositoryGetter,);
    this.registerInclusionResolver('property', this.property.inclusionResolver);
    this.guarantor = this.createBelongsToAccessorFor('guarantor', guarantorRepositoryGetter,);
    this.registerInclusionResolver('guarantor', this.guarantor.inclusionResolver);
    this.contract = this.createBelongsToAccessorFor('contract', contractRepositoryGetter,);
    this.registerInclusionResolver('contract', this.contract.inclusionResolver);
    this.client = this.createBelongsToAccessorFor('client', clientRepositoryGetter,);
    this.registerInclusionResolver('client', this.client.inclusionResolver);
    this.adviser = this.createBelongsToAccessorFor('adviser', adviserRepositoryGetter,);
    this.registerInclusionResolver('adviser', this.adviser.inclusionResolver);
  }
}
