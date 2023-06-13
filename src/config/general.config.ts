export namespace GeneralConfig {
  export const propertiesFilesFolder: string = '../../files/properties';
  export const contractsFilesFolder: string = '../../files/contracts';
  // export const clientsFilesFolder:string  ="../../files/clients";
  export const propertyField: string = 'file';
  export const imagesExtensions: string[] = ['.JPG', '.PNG', '.JPEG'];
  export const documentsExtensions: string[] = ['.PDF'];
  // Types of requests
  export const sale: number = 1;
  export const rent: number = 2;

  // Request statuses
  export const Sent: number = 1;
  export const InStudy: number = 2;
  export const Rejected: number = 3;
  export const AcceptedWithGuarantor: number = 4;
  export const Accepted: number = 5;
  export const Cancelled: number = 6;
}
