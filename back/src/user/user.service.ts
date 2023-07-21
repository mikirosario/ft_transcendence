import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { ThrowHttpException } from '../utils/error-handler';
import { EditUserDto, UserProfileDto, UserProfileUpdateDto } from "./dto";
import { ConfigService } from "@nestjs/config";
import { join } from 'path';
import * as fs from 'fs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserStateChangedEvent } from './user.events';
import { use } from 'passport';


@Injectable()
export class UserService {
	constructor(private prisma: PrismaService, private config: ConfigService,
				private eventEmitter: EventEmitter2) { }

	async getUserById(userId: number) {
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

	async getUserByNick(nick: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				nick: nick,
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
	 * Get user profile data
	*/
	async getProfile(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				nick: true,
				avatarUri: true,
				isSiteOwner: true,
				isSiteAdmin: true
			}
		});
		if (user === null) {
			ThrowHttpException(new NotFoundException, 'User not found');
		}
		
		return user;
	}

	/*
	 * Set / update user profile data and profile picture
	*/
	async updateProfileData(userId: number, dto: UserProfileUpdateDto, file?: Express.Multer.File) {
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

			this.updateUserState(userId);

			if (prevAvatar && prevAvatar !== fileName)
			{
				this.removeAvatar(prevAvatar);
			}

			delete user.hash;
			return user;
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'Nick is already taken');
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

			this.updateUserState(userId);

			this.removeAvatar(avatar);

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
	 * Remove avatar file
	*/
	private async removeAvatar(fileName: string) {
		if (fileName && fileName !== this.config.get('DEFAULT_AVATAR'))
		{
			fs.unlink(join(__dirname, '../../', this.config.get('PATH_AVATARS'), fileName), (err) => {});
		}
	}

	/*
	 * Set user status (online / offline)
	*/
	async setUserStatus(userId: number, isOnline: boolean): Promise<any> {
		try {
			let user: any = await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					isOnline: isOnline
				},
				select: {
					id: true,
					nick: true,
					avatarUri: true,
					isOnline: true,
					isInGame: true,
				}
			});

			return {
					userId: user.id,
					nick: user.nick,
					avatarUri: user.avatarUri,
					isOnline: user.isOnline,
					isInGame: user.isInGame,
				};
		}
		catch (error) {
			return (null);
		}
	}

	/*
	 * Set user status (ingame)
	*/
	async setUserInGame(userId: number, isInGame: boolean): Promise<any> {
		try {
			const user = await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					isInGame: isInGame
				},
			});
			
			delete user.hash;
			return user;
		}
		catch (error) {
			return (null);
		}
	}

	async getUserStatus(userId: number): Promise<any> {
		try {
			let user: any = await this.prisma.user.findFirst({
				where: {
					id: userId
				},
				select: {
					id: true,
					nick: true,
					avatarUri: true,
					isOnline: true,
					isInGame: true,
				}
			});

			return {
					userId: user.id,
					nick: user.nick,
					avatarUri: user.avatarUri,
					isOnline: user.isOnline,
					isInGame: user.isInGame,
				};
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

	async getUserByLogin(login: string): Promise<any> {
		const user = await this.prisma.user.findUnique({
			where: {
				login: login,
			}
		});

		if (user != null)
			delete user.hash;

		return user;
	}

	async getUserAndChatsById(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				chatDirectUser1: {
					select: {
						id: true
					}
				},
				chatDirectUser2: {
					select: {
						id: true
					}
				},
				chatChannelUser: {
					select: {
						channelId: true
					}
				}
			}
		});

		if (user === null) {
			ThrowHttpException(new NotFoundException, 'User not found');
		}

		delete user.hash;
		return user;
	}

	public async updateUserState(userId: number): Promise<void> {
		const user = await this.getUserStatus(userId);
		this.eventEmitter.emit(UserStateChangedEvent.name, new UserStateChangedEvent(user));
	}
}

