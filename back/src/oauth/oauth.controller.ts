import { Get, Controller, Query, Redirect} from "@nestjs/common";
import { OAuthService} from "./oauth.service";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { OAuthDto } from "./dto";
import { UserOAuthDto } from "../user/dto/user-oauth.dto";

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
        const accessToken = await this.oAuthService.exchangeAuthorizationCode(code);
        const userInfo = await this.oAuthService.fetchUserInfo(accessToken);
        let user: UserOAuthDto = {
            login: userInfo.login,
            email: userInfo.email,
            avatar: userInfo.image.versions.small,
        };
        await this.oAuthService.signup(user);
    }
}