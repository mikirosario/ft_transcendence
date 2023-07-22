import { Get, Controller, Query, Res} from "@nestjs/common";
import { OAuthService} from "./oauth.service";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { OAuthDto } from "./dto";
import { UserOAuthDto } from "../user/dto/user-oauth.dto";
import { ThrowHttpException } from "src/utils/error-handler";

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
    async getAuthToken(@Res() res, @Query('code') code: string) {
        const accessToken = await this.oAuthService.exchangeAuthorizationCode(code);
        const userInfo = await this.oAuthService.fetchUserInfo(accessToken);
        let user: UserOAuthDto = {
            login: userInfo.login,
            email: userInfo.email,
            avatar: userInfo.image.versions.small,
        };
        
        try {
            const jwt_token = await this.oAuthService.signup(user);
            const jwt = jwt_token.access_token;

            return res.redirect('http://localhost:3001/register?token=' + jwt);
        } catch (error) {
            return res.redirect('http://localhost:3001/denied');
        }
    }
}
