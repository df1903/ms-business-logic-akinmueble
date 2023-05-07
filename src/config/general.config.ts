export namespace GeneralConfig {
  export const propertiesFilesFolder: string = '../../files/properties';
  // export const clientsFilesFolder:string  ="../../files/clients";
  export const propertyField: string = 'file';
  export const imagesExtensions: string[] = ['.JPG', '.PNG', '.JPEG'];
  export const urlNotifications2FA: string =
    'http://localhost:7183/Notifications/send-code-2fa';
  export const urlNotificationsEmail: string =
    'http://localhost:7183/Notifications/send-email-general';
}
