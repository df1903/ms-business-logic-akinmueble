import {/* inject, */ BindingScope, injectable} from '@loopback/core';

const generator = require('generate-password');

const fetch = require('node-fetch');
@injectable({scope: BindingScope.TRANSIENT})
export class NotificationsService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */

  sendNotification(data: any, url: string): boolean {
    try {
      fetch(url, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'},
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Create random password with n characters
   * @param n password length
   * @returns random password with n characters
   */
  createHash(n: number): string {
    let password = generator.generate({
      length: n,
      numbers: true,
    });
    return password;
  }
}
