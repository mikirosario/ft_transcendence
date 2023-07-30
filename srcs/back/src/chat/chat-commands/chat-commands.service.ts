import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { ChatBlockedUserService } from '../chat-blocked-user/chat-blocked-user.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ChatGateway } from '../chat-socket/chat.gateway';
import * as minimist from 'minimist';
import { ChatCommandMessageDto } from './dto'
import { ChatBlockedDto } from '../chat-blocked-user/dto';
import { ChatChannelBannedUserService } from '../chat-channel-banned-user/chat-channel-banned-user.service';
import { ChatChannelBannedUserDto } from '../chat-channel-banned-user/dto';
import { ChatChannelService } from '../chat-channel/chat-channel.service';
import { ChatChannelUserService } from '../chat-channel-user/chat-channel-user.service';
import { ChatChannelUpdateDto } from '../chat-channel/dto';
import { ChatChannelUserDto } from '../chat-channel-user/dto';


@Injectable()
export class ChatCommandsService {

	// Objeto que mantiene un registro de todos los comandos y sus descripciones
	private commands = {
		'/help': 'Usa /help para mostrar esta lista de comandos',

		'/block': 'Bloquea a un <usuario>',
		'/unblock': 'Desbloquea a un <usuario>',

		// Chat-Commands
		'/mute': 'Silencia a un <usuario> <n> minutos',
		'/unmute': 'Vuelve dejar a escribir a un <usuario> en el chat',
		'/kick': 'Expulsa a un <usuario> de un canal de forma inmediata',
		'/ban': 'Expulsa y deniega el acceso a un <usuario> del canal presente <n> minutos o indefinidamente',
		'/unban': 'Revoca el acceso a un <usuario> de un canal presente',
		'/setadmin': 'Agrega un <usuario> como administrador del canal',
		'/unadmin': 'Elimina un <usuario> como administrador del canal',
		'/changepwd': 'Cambia la <contrasena actual> por una <contrasena nueva>'

	};

	constructor(private prisma: PrismaService, private userService: UserService,
		private chatChannelService: ChatChannelService,
		private chatBlockedUserService: ChatBlockedUserService,
		private chatChannelBannedUserService: ChatChannelBannedUserService,
		private chatChannelUserService: ChatChannelUserService,
		private ws: ChatGateway) { }


	private parseCommand(dto: ChatCommandMessageDto) {
		// Dividir el mensaje de chat en un array de palabras
		let words = dto.message.split(' ');

		// El primer elemento del array debe ser el comando
		let command = words[0];

		// Elimina el primer elemento del array (el comando)
		words.shift();

		// Ahora puedes usar minimist para parsear los argumentos del comando
		let args = minimist(words);

		// Retornar el comando y los argumentos
		return { command, args };
	}

	// Ejemplo de cómo manejar un comando
	private handleCommand(userId: number, chatCommandMessageDto: ChatCommandMessageDto, command: string, args: string[]) {
		console.log('User ID: ' + userId);
		console.log('Command: ' + command);
		console.log('Args: ' + String(args[0]));

		const commandNotExecuted = { commandExecuted: false, response: '', error: false };

		switch (command) {
			case '/help':
				// Si el comando es /help, mostrar la lista de comandos
				console.log('Lista de comandos:');
				for (let cmd in this.commands) {
					console.log(cmd + ' - ' + this.commands[cmd]);
				}
				break;

			case '/block':
				const blockUserDto: ChatBlockedDto = { 'nick': String(args[0]) };
				return this.blockUser(userId, blockUserDto);

			case '/unblock':
				const unblockUserDto: ChatBlockedDto = { 'nick': String(args[0]) };
				return this.unBlockUser(userId, unblockUserDto);

			case '/mute':
				if (chatCommandMessageDto.isDirect) // avoid command in direct chat
					return commandNotExecuted;

				const mutedUserDto: ChatChannelBannedUserDto = {
					channel_id: chatCommandMessageDto.chat_id,
					nick: String(args[0]),
					isMutedSecs: Number(args[1]),
				};
				return this.muteUserInChannel(userId, mutedUserDto);

			case '/unmute':
				if (chatCommandMessageDto.isDirect) // avoid command in direct chat
				return commandNotExecuted;

				const unmutedUserDto: ChatChannelBannedUserDto = {
					channel_id: chatCommandMessageDto.chat_id,
					nick: String(args[0]),
					isMutedSecs: 0,
				};
				return this.unmuteUserInChannel(userId, unmutedUserDto);

			case '/kick':
				if (chatCommandMessageDto.isDirect) // avoid command in direct chat
					return commandNotExecuted;

				const kickUserDto: ChatChannelBannedUserDto = {
					channel_id: chatCommandMessageDto.chat_id,
					nick: String(args[0])
				};
				return this.kickUserInChannel(userId, kickUserDto);

			case '/ban':
				if (chatCommandMessageDto.isDirect) // avoid command in direct chat
					return commandNotExecuted;

				const bannedUserDto: ChatChannelBannedUserDto = {
					channel_id: chatCommandMessageDto.chat_id,
					nick: String(args[0]),
					isBanned: true
				};
				return this.banUserInChannel(userId, bannedUserDto);

			case '/unban':
				if (chatCommandMessageDto.isDirect) // avoid command in direct chat
					return commandNotExecuted;

				const unbannedUserDto: ChatChannelBannedUserDto = {
					channel_id: chatCommandMessageDto.chat_id,
					nick: String(args[0]),
					isBanned: false
				};
				return this.unbanUserInChannel(userId, unbannedUserDto);

			case '/setadmin':
				if (chatCommandMessageDto.isDirect) // avoid command in direct chat
					return commandNotExecuted;

				const setAdminUserDto: ChatChannelUserDto = {
					id: chatCommandMessageDto.chat_id,
					nick: String(args[0]),
					isAdmin: true
				};
				return this.setAdminInChannel(userId, setAdminUserDto);

			case '/unsetadmin':
				if (chatCommandMessageDto.isDirect) // avoid command in direct chat
					return commandNotExecuted;

				const unsetAdminUserDto: ChatChannelUserDto = {
					id: chatCommandMessageDto.chat_id,
					nick: String(args[0]),
					isAdmin: false
				};
				return this.unsetAdminInChannel(userId, unsetAdminUserDto);

			case '/changepwd':
				if (chatCommandMessageDto.isDirect) // avoid command in direct chat
					return commandNotExecuted;

				const updatePassword: ChatChannelUpdateDto = {
					id: chatCommandMessageDto.chat_id,
					password: String(args[0])
				}
				return this.changePasswordInChannel(userId, updatePassword);
				
			default:
				console.log('Comando no reconocido');
				return commandNotExecuted;
		}
	}

	executeCommand(userId: number, chatCommandMessageDto: ChatCommandMessageDto) {
		let command = this.parseCommand(chatCommandMessageDto);
		return this.handleCommand(userId, chatCommandMessageDto, command.command, command.args._);
	}

	private async blockUser(userId: number, dto: ChatBlockedDto) {
		try {
			await this.chatBlockedUserService.chatBlockUser(userId, dto);
			return { commandExecuted: true, response: 'Has bloqueado a ' + dto.nick, error: false };
		} catch (error) {
			return { commandExecuted: true, response: error.response.message, error: true };
		}
	}

	private async unBlockUser(userId: number, dto: ChatBlockedDto) {
		try {
			await this.chatBlockedUserService.chatUnblockUser(userId, dto);
			return { commandExecuted: true, response: 'Has desbloqueado a ' + dto.nick, error: false };
		} catch (error) {
			return { commandExecuted: true, response: error.response.message, error: true };
		}
	}

	private async muteUserInChannel(userId: number, bannedUserDto: ChatChannelBannedUserDto) {
		try {
			await this.chatChannelBannedUserService.muteUserInChannel(userId, bannedUserDto);
			return {
				commandExecuted: true,
				response: 'Has muteado a ' + bannedUserDto.nick + ' por ' + bannedUserDto.isMutedSecs + 'segundos',
				error: false
			};
		} catch (error) {
			return { commandExecuted: true, response: error.response.message, error: true };
		}
	}

	private async unmuteUserInChannel(userId: number, bannedUserDto: ChatChannelBannedUserDto) {
		try {
			await this.chatChannelBannedUserService.muteUserInChannel(userId, bannedUserDto);
			return {
				commandExecuted: true,
				response: 'Has desmuteado a ' + bannedUserDto.nick,
				error: false
			};
		} catch (error) {
			return { commandExecuted: true, response: error.response.message, error: true };
		}
	}

	private async banUserInChannel(userId: number, bannedUserDto: ChatChannelBannedUserDto) {
		try {
			await this.chatChannelBannedUserService.banUserInChannel(userId, bannedUserDto);
			const victim = await this.userService.getUserByNick(bannedUserDto.nick);

			this.ws.sendSocketMessageToUser(victim.id, 'KICK_FROM_CHANNEL', {channelId: bannedUserDto.channel_id});
			
			return {
				commandExecuted: true,
				response: 'Has baneado a ' + bannedUserDto.nick + ' del canal',
				error: false
			};
		} catch (error) {
			return { commandExecuted: true, response: error.response.message, error: true };
		}
	}

	private async unbanUserInChannel(userId: number, bannedUserDto: ChatChannelBannedUserDto) {
		try {
			await this.chatChannelBannedUserService.banUserInChannel(userId, bannedUserDto);
			return {
				commandExecuted: true,
				response: 'Has desbaneado a ' + bannedUserDto.nick + ' del canal',
				error: false
			};
		} catch (error) {
			return { commandExecuted: true, response: error.response.message, error: true };
		}
	}

	private async kickUserInChannel(userId: number, bannedUserDto: ChatChannelBannedUserDto) {
		try {
			const victim = await this.userService.getUserByNick(bannedUserDto.nick);
			await this.chatChannelService.checkUserIsAuthorizedInChannnel(userId, bannedUserDto.channel_id);

			const victimChannelUser = await this.chatChannelService.getChannelUser(bannedUserDto.channel_id, victim.id);

			if (victimChannelUser.isOwner)
				ThrowHttpException(new UnauthorizedException, 'No tienes permiso para echar al propietario del canal');

			await this.chatChannelUserService.leaveChannel(victim.id, {id: bannedUserDto.channel_id});
			this.ws.sendSocketMessageToUser(victim.id, 'KICK_FROM_CHANNEL', {channelId: bannedUserDto.channel_id});
			
			return {
				commandExecuted: true,
				response: 'Has echado a ' + bannedUserDto.nick + ' del canal',
				error: false
			};
		} catch (error) {
			return { commandExecuted: true, response: error.response.message, error: true };
		}
	}

	private async changePasswordInChannel(userId: number, dto: ChatChannelUpdateDto) {
		try {
			await this.chatChannelService.updateChannel(userId, dto);
			
			return {
				commandExecuted: true,
				response: 'Has modificado la contraseña del canal',
				error: false
			};
		} catch (error) {
			return { commandExecuted: true, response: error.response.message, error: true };
		}
	}

	private async setAdminInChannel(userId: number, dto: ChatChannelUserDto) {
		try {
			await this.chatChannelUserService.updateChannelUser(userId, dto);
			
			return {
				commandExecuted: true,
				response: 'Has hecho administrador del canal a ' + dto.nick,
				error: false
			};
		} catch (error) {
			return { commandExecuted: true, response: error.response.message, error: true };
		}
	}

	private async unsetAdminInChannel(userId: number, dto: ChatChannelUserDto) {
		try {
			await this.chatChannelUserService.updateChannelUser(userId, dto);
			
			return {
				commandExecuted: true,
				response: 'Has quitado el permiso de administrador de canal a ' + dto.nick,
				error: false
			};
		} catch (error) {
			return { commandExecuted: true, response: error.response.message, error: true };
		}
	}


}
