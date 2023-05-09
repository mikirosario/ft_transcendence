import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { Response } from "express";
import { join } from 'path';
import * as fs from 'fs';


@Injectable()
export class ServeImageService {
	constructor(private prisma: PrismaService) { }

	async serveImage(userId: number, fileName: string, res: Response) {
		const filePath = join(__dirname, '../../../uploads/avatars/', fileName);

		if (!fs.existsSync(filePath)) {
			return res.status(404).send('El archivo no existe');
		}
		
		return res.sendFile(filePath);
	}

}
