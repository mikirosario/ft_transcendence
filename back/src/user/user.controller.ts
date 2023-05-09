import { Controller, Get, UseGuards, Req, Patch, Body, NotFoundException, Delete, Post, UseInterceptors, UploadedFile, Put } from "@nestjs/common";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { JwtGuard } from "../auth/guard";
import { GetJwt } from "../auth/decorator";
import { EditUserDto, UserProfileDto } from "./dto";
import { UserService } from "./user.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';


@UseGuards(JwtGuard)
@Controller('users')
@ApiBearerAuth()
export class UserController {
	constructor(private userService: UserService) { }
	@Get('me')
	async getMe(@GetJwt('sub') userId: number) {
		return this.userService.getMe(userId);
	}

	@Patch('me')
	@ApiBody({ type: EditUserDto })
	async editUser(@GetJwt('sub') userId: number, @Body() dto: EditUserDto) {
		return this.userService.editUser(userId, dto);
	}

	@Delete('me')
	async deleteUser(@GetJwt('sub') userId: number) {
		return this.userService.deleteUser(userId);
	}

	/*
	 * Set / update user profile data
	*/
	@Put('profile')
	@ApiBody({ type: UserProfileDto })
	async updateProfileData(@GetJwt('sub') userId: number, @Body() dto: UserProfileDto) {
		return this.userService.updateProfileData(userId, dto);
	}

	/*
	 * Set / update user profile picture
	*/
	@Post('profile')
	@UseInterceptors(FileInterceptor('file', {
		storage: diskStorage({
			destination: './uploads/avatars',
			filename: (req, file, cb) => {
				const filename: string = uuidv4();
				const path = require('path');
				const extension: string = path.parse(file.originalname).ext;
				cb(null, filename + extension)
			}
		})
	}))
	async uploadProfilePicture(@GetJwt('sub') userId: number, @UploadedFile() file?: Express.Multer.File) {
		return this.userService.uploadProfilePicture(userId, file);
	}

	/*
	 * Remove user profile picture
	*/
	@Delete('profile')
	async deleteProfilePicture(@GetJwt('sub') userId: number) {
		return this.userService.deleteProfilePicture(userId);
	}
	
}
