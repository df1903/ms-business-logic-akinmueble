import {AuthenticationStrategy} from '@loopback/authentication';
import {AuthenticationBindings} from '@loopback/authentication/dist/keys';
import {AuthenticationMetadata} from '@loopback/authentication/dist/types';
import {inject} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';

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
    console.log("Executing strategy");

    let token = parseBearerToken(request);
    if (token){
      let idMenu: string = this.metadata![0].options![0];
      let action: string = this.metadata[0].options![1];
      console.log(this.metadata)
      // connect with ms of security
      console.log("connect with ms of security")
      let proceed: boolean = false;
        if(proceed){
          let profile: UserProfile = Object.assign({
            permitted: "Ok"
          });
          return profile;
        } else {
          return undefined;
        }
        }
        throw new HttpErrors[401]("It is not possible to execute the action due to lack of permissions.");
    }
}
