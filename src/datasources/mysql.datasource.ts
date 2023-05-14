import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {SecurityConfig} from '../config/security.config';

const config = {
  name: 'mysql',
  connector: 'mysql',
  url: '',
  // host: 'localhost',
  // user: 'root',
  // password: '12345678',
  // database: 'akinmuebledb',
  host: SecurityConfig.hostMysql,
  port: 3306,
  user: 'admin',
  password: SecurityConfig.passwordMysql,
  database: SecurityConfig.nameDatabase,
};
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MysqlDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'mysql';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mysql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
