export namespace SecurityConfig {
  export const menuPropertyId = "642ce496db8a5109ec877cdb";
  export const listAction = "list";
  export const saveAction = "save";
  export const editAction = "edit";
  export const deleteAction = "delete";
  export const downloadAction = "download";
  export const createAction = "create";
  export const securityMicroserviceLink: string = "http://localhost:3001";
  export const hostMysql = process.env.HOST_STRING_MYSQL;
  export const passwordMysql = process.env.PASSWORD_MYSQL;
  export const nameDatabase = process.env.NAME_DATABASE

}
