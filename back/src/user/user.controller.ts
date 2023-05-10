import { Controller, Get, UseGuards, Patch, Body, Delete, Post, UseInterceptors, UploadedFile, Put } from "@nestjs/common";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { JwtGuard } from "../auth/guard";
import { GetJwt } from "../auth/decorator";
import { EditUserDto, UserProfileDto } from "./dto";
import { UserService } from "./user.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { saveProfileImageToStorage } from "../utils/image-storage"


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

	/*
	 * Delete user and all its data (avatar, ...)
	*/
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
	@UseInterceptors(FileInterceptor('file', saveProfileImageToStorage))
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
