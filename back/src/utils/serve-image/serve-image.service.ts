import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { join } from 'path';
import * as fs from 'fs';


@Injectable()
export class ServeImageService {
	constructor(private prisma: PrismaService, private config: ConfigService) { }

	async serveImage(userId: number, fileName: string, res: Response) {
		const filePath = join(__dirname, '../../../uploads/avatars/', fileName);
		if (fs.existsSync(filePath)) {
			return res.sendFile(filePath);
		}

		const defaultPath = join(__dirname, '../../../', this.config.get('DEFAULT_AVATAR_URI'));
		if (fs.existsSync(defaultPath)) {
			return res.sendFile(defaultPath);
		}
		
		return res.status(404).send('El archivo no existe');
	}

}
