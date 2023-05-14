import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { ThrowHttpException } from '../utils/error-handler';
import { EditUserDto, UserProfileDto } from "./dto";
import { ConfigService } from "@nestjs/config";
import { join } from 'path';
import * as fs from 'fs';


@Injectable()
export class UserService {
	constructor(private prisma: PrismaService, private config: ConfigService) { }
	async getMe(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			}
		});
		if (user === null) {
			ThrowHttpException(new NotFoundException, 'User not found');
		}
		delete user.hash;
		return user;
	}

	async editUser(userId: number, dto: EditUserDto) {
		try {
			const user = await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					...dto,
				},
			});
			delete user.hash;
			return user;
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				// https://www.prisma.io/docs/reference/api-reference/error-reference
				// P2025 Record not found
				ThrowHttpException(error, 'User not found');
			}
		}
	}

	/*
	 * Delete user and all its data (avatar, ...)
	*/
	async deleteUser(userId: number) {

		try {
			const user = await this.prisma.user.delete({
				where: {
					id: userId
				}
			});
			
			this.removeAvatar(user.avatarUri);
			delete user.hash;
			return user;
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'User not found');
			}
		}
	}

	/*
	 * Set / update user profile data and profile picture
	*/
	async updateProfileData(userId: number, dto: UserProfileDto, file?: Express.Multer.File) {
		let fileName = file?.filename;

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			}
		});

		if (user === null) {
			if (file)
			{
				this.removeAvatar(file.filename)
			}
			
			ThrowHttpException(new NotFoundException, 'User not found');
		}

		const prevAvatar = user.avatarUri;
		
		if (!fileName)
		{
			fileName = prevAvatar;
		}

		try {
			const user = await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					nick: dto.nick,
					avatarUri: fileName
				},
			});

			if (prevAvatar && prevAvatar !== fileName)
			{
				this.removeAvatar(prevAvatar);
			}

			delete user.hash;
			return user;
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				// https://www.prisma.io/docs/reference/api-reference/error-reference
				// P2025 Record not found
				ThrowHttpException(error, 'User not found');
			}
		}
	}

	/*
	 * Remove user profile picture
	*/
	async deleteProfilePicture(userId: number) {

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			}
		});

		if (user === null) {
			ThrowHttpException(new NotFoundException, 'User not found');
		}

		const avatar = user.avatarUri;

		try {
			const user = await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					avatarUri: this.config.get('DEFAULT_AVATAR')
				},
			});

			this.removeAvatar(avatar);

			delete user.hash;
			return user;
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				// https://www.prisma.io/docs/reference/api-reference/error-reference
				// P2025 Record not found
				ThrowHttpException(error, 'User not found');
			}
		}
	}

	/*
	 * Remove avatar file
	*/
	async removeAvatar(fileName: string) {
		if (fileName && fileName !== this.config.get('DEFAULT_AVATAR'))
		{
			fs.unlink(join(__dirname, '../../', this.config.get('PATH_AVATARS'), fileName), (err) => {
				if (err)
					console.log(err);
			})
		}
	}

	/*
	 * Set user status (co)
	*/
	async setUserStatus(userId: number, status: string): Promise<any> {
		try {
			const user = await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					status: status
				},
			});
			delete user.hash;
			return user;
		}
		catch (error) {
			return (null);
		}
	}

	async doesUserExit(userId: number): Promise<boolean> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			}
		});
		
		if (user === null) {
			return false;
		}
		
		return true;
	}
}
