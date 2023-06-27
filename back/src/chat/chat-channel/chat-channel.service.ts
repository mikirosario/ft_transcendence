import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatChannelCreateDto, ChatChannelUpdateDto } from "./dto";
import { UserService } from '../../user/user.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from "argon2";
import { ChatGateway } from '../chat-socket/chat.gateway';

@Injectable()
export class ChatChannelService {
	constructor(private prisma: PrismaService, private userService: UserService, private ws: ChatGateway) { }

	async createChannel(userId: number, dto: ChatChannelCreateDto) {

		this.ws.sendSocketMessage(userId, "ID_A", "Nuevo canal bobo!");

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
			
			await this.joinChannelOwner(newChannel.id, user.id);

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

	private async joinChannelOwner(channelId: number, userId: number) {
		try {
			await this.prisma.chatChannelUser.create({
				data: {
					channelId: channelId,
					userId: userId,
					isOwner: true
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

		const myChannelsList = myChannels.map(channel => channel.channel.name);

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
						channel: {
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
						}
					},
				}
			},
		});

		if (user === null) {
			ThrowHttpException(new NotFoundException, 'User not found');
		}

		const myChannels = user.chatChannelUser;
		const myChannelsList = myChannels.map(channel => channel);


		return myChannelsList;
	}

	private async getAllPublicChannels(myChannels: string[]) {
		return await this.prisma.chatChannel.findMany({
			where: {
				NOT: {
					name: {
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

	private formatChannelsList(channelsList: any) {
		const channelsListFormatted: any[] = channelsList.map((channel) => ({
			id: channel.channel.id,
			name: channel.channel.name,
			isPrivate: channel.channel.isPrivate,
			createdAt: channel.channel.createdAt,
			joinedAt: channel.joinedAt,
			isOwner: channel.isOwner,
			isAdmin: channel.isAdmin,
			members: this.formatChannelUsers(channel.channel.chatChannelUser),
			messages: this.formatChannelMessages(channel.channel.chatChannelMessage)
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
			id: msg.id,
			sentAt: msg.sentAt,
			nick: msg.user.nick,
			message: msg.message
		}));

		return messageListFormatted;
	}

}
