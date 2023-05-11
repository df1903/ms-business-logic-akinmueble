export namespace NotificationsConfig {
  // Email subjects
  export const emailSubjectVerificateEmail = 'Confirm your Email';
  export const emailSubjectAdviserChange = 'Alert: Adviser Changed';
  export const emailSubjectRequestResponse = 'Request response';
  export const emailSubjectNewAdviserSignUp = 'New adviser sign up';
  export const emailSubjectAdviserSignUpResponse =
    'Response: Adviser Application';
  // SMS links
  export const urlNotificationsSMS: string =
    'http://localhost:7183/Notifications/send-sms';
  // Email links
  export const urlFrontHashVerification: string =
    'http://localhost:4200/hash-verification';
  export const urlNotifications2FA: string =
    'http://localhost:7183/Notifications/send-code-2fa';
  export const urlNotificationsEmail: string =
    'http://localhost:7183/Notifications/send-email-general';
}
