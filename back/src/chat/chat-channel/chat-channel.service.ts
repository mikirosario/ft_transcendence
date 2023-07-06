import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatChannelCreateDto, ChatChannelUpdateDto } from "./dto";
import { UserService } from '../../user/user.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from "argon2";
import { ChatGateway } from '../chat-socket/chat.gateway';
import { use } from 'passport';

@Injectable()
export class ChatChannelService {
	constructor(private prisma: PrismaService, private userService: UserService, private ws: ChatGateway) { }

	async getChannelChat(userId: number, channelId: number) {
		const channel = await this.getChannelChatInfo(userId, channelId);
		return this.formatChannel(channel);
	}
	
	async createChannel(userId: number, dto: ChatChannelCreateDto) {

		let hash: string = null;
		let isPrivate: boolean = false;

		const user = await this.userService.getUserById(userId);

		if (dto.password != null && dto.password.length > 0)
		{
			hash = await argon.hash(dto.password);
			isPrivate = true;
		}
		
		try {
			const newChannel = await this.prisma.chatChannel.create({
				data: {
					name: dto.name,
					isPrivate: isPrivate,
					hash: hash
				}
			});
			
			await this.joinChannel(newChannel.id, user.id, true);

			delete newChannel.hash;
			return newChannel;

		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'Already exists a channel with that name');
			}
		}
	}

	async updateChannel(userId: number, dto: ChatChannelUpdateDto) {
		let hash: string = null;
		let isPrivate: boolean = false;

		const user = await this.userService.getUserById(userId);
		const channel = await this.getChannel(dto.id);

		await this.checkUserIsAuthorizedInChannnel(user.id, channel.id);

		if (dto.password != null && dto.password.length > 0)
		{
			hash = await argon.hash(dto.password);
			isPrivate = true;
		}

		try {
			const channel = await this.prisma.chatChannel.update({
				where: {
					id: dto.id
				},
				data: {
					name: dto.name,
					isPrivate: isPrivate,
					hash: hash
				}
			});

			delete channel.hash;
			return channel;

		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'Already exists a channel with that name');
			}
		}
	}

	async deleteChannel(userId: number, dto: ChatChannelUpdateDto) {
		const user = await this.userService.getUserById(userId);
		const channel = await this.getChannel(dto.id);

		await this.checkUserIsAuthorizedInChannnel(user.id, channel.id);

		await this.prisma.chatChannel.delete({
			where: {
				id: channel.id
			}
		});

		delete channel.hash;
		return channel;
	}

	/*
	 * Private methods
	*/
	async getChannel(channelId: number) {
		if (channelId == null)
			ThrowHttpException(new BadRequestException, 'You must provide channel id');

		const channel = await this.prisma.chatChannel.findUnique({
			where: {
				id: channelId,
			}
		});

		if (channel === null) {
			ThrowHttpException(new NotFoundException, 'Channel not found');
		}

		return channel;
	}

	async checkUserIsAuthorizedInChannnel(userId: number, channelId: number) {

		try {
			const channelUser = await this.getChannelUser(channelId, userId);

			if (channelUser.isOwner || channelUser.isAdmin)
				return true;
		} catch (error) {
			ThrowHttpException(new UnauthorizedException, 'You must be channel owner or admin to do this action');
		}
		
		ThrowHttpException(new UnauthorizedException, 'You must be channel owner or admin to do this action');
	}

	async getChannelUser(channel_id: number, user_id: number) {
		const channelUser = await this.prisma.chatChannelUser.findFirst({
			where: {
				channelId: channel_id,
				userId: user_id,
			}
		});

		if (channelUser == null)
			ThrowHttpException(new NotFoundException, 'User not in channel');

		return channelUser;
	}

	private async joinChannel(channelId: number, userId: number, isOwner: boolean) {
		try {
			await this.prisma.chatChannelUser.create({
				data: {
					channelId: channelId,
					userId: userId,
					isOwner: isOwner
				}
			});
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'You are already on this channel');
			}
		}
	}

	async getBannedUser(channelId: number, userId: number)
	{
		let channelBannedUser = await this.prisma.chatChannelBannedUser.findFirst({
			where: {
				channelId: channelId,
				userId: userId,
			}
		});

		if (channelBannedUser)
			return channelBannedUser;
			
		try {
			channelBannedUser = await this.prisma.chatChannelBannedUser.create({
				data: {
					channelId: channelId,
					userId: userId
				}
			});
			return channelBannedUser;

		} catch (error) {
			return null;
		}
	}

	async isUserBlocked(channelId: number, userId: number) {
		const channelBannedUser = await this.getBannedUser(channelId, userId);

		if (!channelBannedUser)
			return false;

		return channelBannedUser.isBanned;
	}

	async isUserMuted(channelId: number, userId: number) {
		const channelBannedUser = await this.getBannedUser(channelId, userId);

		if (!channelBannedUser)
			return false;

		let currentTime = new Date().getTime();
		let mutedUntil = new Date(channelBannedUser.isMutedUntil).getTime();

		if (mutedUntil > currentTime)
			return true;
		return false;
	}


	async getMyChannelsAndPublicChannels(userId: number) {
		const myChannels = await this.getMyChannels(userId);

		const myChannelsList = myChannels.map(channel => channel.id);

		const publicChannels = await this.getAllPublicChannels(myChannelsList);

		const myChannelsAndPublicChannelsList = [...myChannels, ...publicChannels];

		const formattedChannelsList = this.formatChannelsList(myChannelsAndPublicChannelsList);

		return formattedChannelsList;
	}


	private async getMyChannels(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId, },
			include: {
				chatChannelUser: {
					include: {
						channel: true
					},
				}
			},
		});

		if (user === null) {
			ThrowHttpException(new NotFoundException, 'User not found');
		}

		const myChannels = user.chatChannelUser;
		const myChannelsList = myChannels.map(channel => channel.channel);

		return myChannelsList;
	}

	private async getChannelChatInfo(userId: number, channelId: number) {
		let channelChatInfo = await this.prisma.chatChannel.findFirst({
			where: {
				id: channelId
			},
			include: {
				chatChannelUser: {
					include: {
						user: true,
					},
				},
				chatChannelMessage: {
					include: {
						user: true
					}
				}
			}
		});

		if (!channelChatInfo)
			return {};

		let userInChannel = false;
		channelChatInfo.chatChannelUser.forEach((item) => {
			if (item.userId == userId) {
				userInChannel = true;
			}
		});

		if (userInChannel) {
			return channelChatInfo;
		}
		else {
			await this.joinChannel(channelId, userId, false);
			return await this.getChannelChatInfo(userId, channelId);
		}
		
	}

	private async getAllPublicChannels(myChannels: number[]) {
		return await this.prisma.chatChannel.findMany({
			where: {
				NOT: {
					id: {
						in: myChannels
					},
				},
				isPrivate: false
			},
			include: {
				chatChannelUser: {
					include: {
						user: true
					}
				},
				chatChannelMessage: {
					include: {
						user: true
					}
				}
			}
		});
	}

	private formatChannel(channel) {
		const channelFormatted = {
			id: channel.id,
			name: channel.name,
			isPrivate: channel.isPrivate,
			createdAt: channel.createdAt,
			members: this.formatChannelUsers(channel.chatChannelUser),
			messages: this.formatChannelMessages(channel.chatChannelMessage)
		};

		return channelFormatted;
	}

	private formatChannelsList(channelsList: any) {
		const channelsListFormatted: any[] = channelsList.map((channel) => ({
			id: channel.id,
			name: channel.name
		}));

		return channelsListFormatted;
	}

	private formatChannelUsers(userList: any) {
		const userListFormatted: any[] = userList.map((user) => ({
			id: user.user.id,
			nick: user.user.nick,
			avatarUri: user.user.avatarUri,
			isOnline: user.user.isOnline,
			isInGame: user.user.isInGame,
			joinedAt: user.joinedAt,
			isOwner: user.isOwner,
			isAdmin: user.isAdmin
		}));

		return userListFormatted;
	}

	private formatChannelMessages(messageList: any) {
		const messageListFormatted: any[] = messageList.map((msg) => ({
			sentAt: msg.sentAt,
			nick: msg.user.nick,
			message: msg.message
		}));

		return messageListFormatted;
	}

}
