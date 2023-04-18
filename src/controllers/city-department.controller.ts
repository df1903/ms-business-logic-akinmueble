import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {SecurityConfig} from '../config/security.config';
import {City, Department} from '../models';
import {CityRepository} from '../repositories';

export class CityDepartmentController {
  constructor(
    @repository(CityRepository)
    public cityRepository: CityRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuCityId, SecurityConfig.listAction],
  })
  @get('/cities/{id}/department', {
    responses: {
      '200': {
        description: 'Department belonging to City',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Department),
          },
        },
      },
    },
  })
  async getDepartment(
    @param.path.string('id') id: typeof City.prototype.id,
  ): Promise<Department> {
    return this.cityRepository.department(id);
  }
}
