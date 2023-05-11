import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {SecurityConfig} from '../config/security.config';

const generator = require('generate-password');

const fetch = require('node-fetch');
@injectable({scope: BindingScope.TRANSIENT})
export class SecurityService {
  constructor() {}

  /*
   * Add service methods here
   */

  /**
   * Create random text with n characters
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

  /**
   * Method to send notification connected with the notification microservice
   * @param data
   * @param url
   * @returns Boolean
   */
  createAdvisor(data: any, token: string): boolean {
    try {
      let info = {
        firstName: data.firstName,
        secondName: data.secondName,
        firstLastname: data.firstLastname,
        secondLastname: data.secondLastname,
        document: data.document,
        email: data.email,
        phone: data.phone,
        roleId: SecurityConfig.adviserRole,
      };
      fetch(SecurityConfig.createUser, {
        method: 'post',
        body: JSON.stringify(info),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}
