import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { Response } from "express";
import { join } from 'path';


@Injectable()
export class ServeImageService {
	constructor(private prisma: PrismaService) { }

	async serveImage(userId: number, filename: string, res: Response) {
		return res.sendFile(join(__dirname, '../../../uploads/avatars/', filename));
	}

}
