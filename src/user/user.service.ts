import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) { }
	async getMe(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			}
		});
		if (user === null) {
			throw new NotFoundException('User not found');
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
			if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025')
				throw new NotFoundException('User not found');
		}
	}
}
