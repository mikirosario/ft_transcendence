import { Get, Controller, Query, Redirect} from "@nestjs/common";
import { OAuthService} from "./oauth.service";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { OAuthDto } from "./dto";

@Controller('oauth')
@ApiBearerAuth()
export class OAuthController {
    constructor(private oAuthService: OAuthService){}

    @Get('generateAuthURL')
    generateAuthURL() {
        const authorizationUrl = this.oAuthService.generateAuthorizationUrl();
        console.log(authorizationUrl)
        return { url: authorizationUrl };
    }

    @Get('getAuthToken')
    @ApiBody({type: OAuthDto})
    @Redirect('http://localhost:3001/register')
    async getAuthToken(@Query('code') code: string){
        console.log(code);
        const accessToken = await this.oAuthService.exchangeAuthorizationCode(code);
        console.log(accessToken);
    
        /*const isUserLoggedIn = request.isAuth();
        if(isUserLoggedIn){
            return {url: '/pong'}
        }*/
        //TODO redirigir si esta log already a menu base si no el otro
    }
}