export namespace SecurityConfig {
  // Security variables
  export const securityMicroserviceLink: string = 'http://localhost:3001';
  export const hostMysql = process.env.HOST_STRING_MYSQL;
  export const passwordMysql = process.env.PASSWORD_MYSQL;
  export const nameDatabase = process.env.NAME_DATABASE;
  export const token = process.env.TOKEN;
  // Roles
  export const adviserRole = '643c8b6611b852318822326a';
  export const clientRole = '643c8b7111b852318822326b';
  // Menu id
  export const menuPropertyId = '642ce496db8a5109ec877cdb';
  export const menuRequestId = '643dd7c10349685918540d80';
  export const menuAdviserId = '643dd7670349685918540d78';
  export const menuCityId = '643dd7710349685918540d79';
  export const menuDepartmentId = '643dd7790349685918540d7a';
  export const menuClientId = '643dd7830349685918540d7b';
  export const menuContractId = '643dd78b0349685918540d7c';
  export const menuFileManagerId = '643dd79c0349685918540d7d';
  export const menuGuarantorId = '643dd7a90349685918540d7e';
  export const menuPhotoId = '643dd7b40349685918540d7f';
  export const menuPropertyTypeId = '643dd8270349685918540d82';
  export const menuRequestTypeId = '643dd8300349685918540d83';
  // Actions
  export const listAction = 'list';
  export const listClientAction = 'listClient';
  export const saveAction = 'save';
  export const editAction = 'edit';
  export const deleteAction = 'delete';
  export const downloadAction = 'download';
  export const createAction = 'create';
  // Url
  export const createUser: string = 'http://localhost:3001//user';
}
