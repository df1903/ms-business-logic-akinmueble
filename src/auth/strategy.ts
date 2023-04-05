import {AuthenticationStrategy} from '@loopback/authentication';
import {AuthenticationBindings} from '@loopback/authentication/dist/keys';
import {AuthenticationMetadata} from '@loopback/authentication/dist/types';
import {inject} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {SecurityConfig} from '../config/security.config';
const fetch = require('node-fetch');

export class AuthStrategy implements AuthenticationStrategy {
  name: string = 'auth';

  constructor(

    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata[],
  ) {}

  /**
   * Authentication of a user against an action in the database
   * @param request the request with the token
   * @returns The user profile, undefined when you don't have permission or an httpError
   */
  async authenticate(request: Request): Promise<UserProfile | undefined> {

    let token = parseBearerToken(request);
    if (token){
      let idMenu: string = this.metadata[0].options![0];
      let action: string = this.metadata[0].options![1];
      console.log(this.metadata)

      const data = { token: token, idMenu: idMenu, action: action };
      const urlValidatePermissions = `${SecurityConfig.securityMicroserviceLink}/validate-permissions`;
      let res = undefined;
      try{
        await fetch(urlValidatePermissions, {
          method: 'post',
          body:    JSON.stringify(data),
          headers: { 'Content-Type': 'application/json'},
        }).then((res:any) => res.json())
          .then((json:any) => {
            res = json;
          });
          if(res){
            let profile: UserProfile = Object.assign({
              permitted: "Ok"
            });
            return profile;
          } else {
            return undefined;
          }
      } catch (e) {
        throw new HttpErrors[401]("xYou do not have permissions on the action to execute.");
      }
    }
        throw new HttpErrors[401]("It is not possible to execute the action due to lack of permissions.");
    }
}
