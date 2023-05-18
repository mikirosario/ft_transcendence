import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { ConfigService } from '@nestjs/config';
import axios from "axios";

@Injectable()
export class OAuthService{
    constructor (private config: ConfigService){}

    private readonly clientId: string = this.config.get('CLIENT_ID');
    private readonly clientSecret: string = this.config.get('CLIENT_SECRET');
    private readonly redirectUri: string = this.config.get('REDIRECT_URI');
    private readonly tokenEndpoint: string = 'https://api.intra.42.fr/oauth/token';
    private readonly authorizationEndpoint: string = 'https://api.intra.42.fr/oauth/authorize';
  
    async exchangeAuthorizationCode(code: string): Promise<string> {
      try {
        const response: AxiosResponse = await axios.post(this.tokenEndpoint, {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          redirect_uri: this.redirectUri,
        });
  
        return response.data.access_token;
      } catch (error) {
        throw new Error('Failed to exchange authorization code for access token.');
      }
    }
  
    generateAuthorizationUrl(): string {
      const authorizationUrl = `${this.authorizationEndpoint}?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code`;
      return authorizationUrl;
    }
}