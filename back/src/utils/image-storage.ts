import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import path = require('path');

;
export const saveProfileImageToStorage = {
	storage: diskStorage({
		destination: './uploads/avatars',
		filename: (req, file, cb) => {
			const fileName: string = uuidv4();
			const fileExtension: string = path.parse(file.originalname).ext;
			cb(null, fileName + fileExtension);
		}
	}),
	fileFilter: (req, file, cb) => {
		const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];

		allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
	},
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	}
}
