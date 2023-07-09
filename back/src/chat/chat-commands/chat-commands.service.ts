import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { ChatBlockedUserService } from '../chat-blocked-user/chat-blocked-user.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ChatGateway } from '../chat-socket/chat.gateway';
import * as minimist from 'minimist';
import { ChatChannelMessageDto } from '../chat-channel-message/dto'


@Injectable()
export class ChatCommandsService {

	// Objeto que mantiene un registro de todos los comandos y sus descripciones
	private commands = {
		'/say': 'Usa /say [mensaje] para decir algo',
		'/help': 'Usa /help para mostrar esta lista de comandos',
		// Agrega aquí más comandos...
	};

	constructor(private prisma: PrismaService, private userService: UserService,
		private chatBlockedUserService: ChatBlockedUserService,
		private ws: ChatGateway) { }


	private parseCommand(dto: ChatChannelMessageDto) {
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
	private handleCommand(command, dto: ChatChannelMessageDto) {
		console.log(command);
		console.log(dto);

		switch (command.command) {
			case '/help':
				// Si el comando es /help, mostrar la lista de comandos
				console.log('Lista de comandos:');
				for (let cmd in this.commands) {
					console.log(cmd + ' - ' + this.commands[cmd]);
				}
				break;
			// Aquí puedes agregar más casos para manejar otros comandos...
			default:
				console.log('Comando no reconocido');
				return false;
		}

		return true;
	}

	executeCommand(dto: ChatChannelMessageDto) {
		let command = this.parseCommand(dto);
		return this.handleCommand(command, dto);
	}

}
