import { Get, Controller, Query } from "@nestjs/common";
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
    async getAuthToken(@Query('code') code: string){
        console.log(code);
        const accessToken = await this.oAuthService.exchangeAuthorizationCode(code);
        console.log(accessToken);
        
        //TODO redirigir a donde tenga que redirigir
        return { url: '/' };
    }

}