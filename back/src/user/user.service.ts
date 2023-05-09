import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { ThrowHttpException } from '../utils/error-handler';
import { EditUserDto, UserProfileDto } from "./dto";
import { ConfigService } from "@nestjs/config";
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
	async deleteUser(userId: number) {
		try {
			const user = await this.prisma.user.delete({
				where: {
					id: userId
				}
			});
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
	 * Set / update user profile data
	*/
	async updateProfileData(userId: number, dto: UserProfileDto) {

		try {
			const user = await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					...dto
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
	 * Set / update user profile picture
	*/
	async uploadProfilePicture(userId: number, file: Express.Multer.File) {

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			}
		});

		if (user === null) {
			if (file)
			{
				this.removeAvatar(file.path)
			}
			
			ThrowHttpException(new NotFoundException, 'User not found');
		}

		const prevAvatar = user.avatarUri;

		try {
			const user = await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					avatarUri: file.path
				},
			});

			this.removeAvatar(prevAvatar);

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
					avatarUri: this.config.get('DEFAULT_AVATAR_URI')
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
	async removeAvatar(filePath: string) {
		if (filePath && filePath !== this.config.get('DEFAULT_AVATAR_URI'))
		{
			fs.unlink(filePath, (err) => {
				if (err)
					console.log(err);
			})
		}
	}
}
