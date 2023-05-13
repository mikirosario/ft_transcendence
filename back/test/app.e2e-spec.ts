import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto, UserProfileDto } from '../src/user/dto';
import { readFileSync } from "fs";
import { File } from "buffer";

describe('App e2e', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		app = moduleRef.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({ whitelist: true, }));
		await app.init();
		await app.listen(3000);
		prisma = app.get(PrismaService);
		pactum.request.setBaseUrl('http://localhost:3000');
		await prisma.cleanDb();
	});
	afterAll(() => {
		app.close();
	});

	describe('Auth', () => {
		const dto: AuthDto = {
			email: 'test@testapp.com',
			password: '123',
			nick: 'testuser'
		}
		const dtoDel: AuthDto = {
			email: 'test2@testapp.com',
			password: '321',
			nick: 'testuser2'
		}
		describe('Signup', () => {
			it('should throw if no body', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.expectStatus(400);
			})
			it('should throw if email empty', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody({
						password: dto.password,
						nick: dto.nick
					})
					.expectStatus(400);
			});
			it('should throw if not email', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody({
						password: dto.password,
						email: 'bademail',
						nick: dto.nick
					})
					.expectStatus(400);
			});
			it('should throw if password empty', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody({
						email: dto.email,
						nick: dto.nick
					})
					.expectStatus(400);
			})
			it('should sign up', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody(dto)
					.expectStatus(201);
			});
			it('should sign up', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody(dtoDel)
					.expectStatus(201);
			});
		});
		describe('Signin', () => {
			it('should throw if no body', () => {
				return pactum
					.spec()
					.post('/auth/signin')
					.expectStatus(400);
			})
			it('should throw if email empty', () => {
				return pactum
					.spec()
					.post('/auth/signin')
					.withBody({
						password: dto.password,
						nick: dto.nick
					})
					.expectStatus(400);
			});
			it('should throw if not email', () => {
				return pactum
					.spec()
					.post('/auth/signin')
					.withBody({
						password: dto.password,
						email: 'bademail',
						nick: dto.nick
					})
					.expectStatus(400);
			});
			it('should throw if password empty', () => {
				return pactum
					.spec()
					.post('/auth/signin')
					.withBody({
						email: dto.email,
						nick: dto.nick
					})
					.expectStatus(400);
			})
			it('should sign in', () => {
				return pactum
					.spec()
					.post('/auth/signin')
					.withBody(dto)
					.expectStatus(200)
					.stores('userAt', 'access_token');
			});
			it('should sign in', () => {
				return pactum
					.spec()
					.post('/auth/signin')
					.withBody(dtoDel)
					.expectStatus(200)
					.stores('userAtDel', 'access_token');
			});
		});

	});
	describe('User', () => {
		describe('DeleteUser', () => {
			it('should delete user', () => {
				return pactum
					.spec()
					.delete('/users/me')
					.withHeaders({
						Authorization: 'Bearer $S{userAtDel}',
					})
					.expectStatus(200)
			});
			it('should throw 404 if user not found', () => {
				return pactum
					.spec()
					.delete('/users/me')
					.withHeaders({
						Authorization: 'Bearer $S{userAtDel}',
					})
					.expectStatus(404)
			});
		})
		describe('EditUser', () => {
			const dto: EditUserDto = {
				firstName: "Miki",
				email: "miki@42mars.com"
			}
			it('should edit user', () => {
				return pactum
					.spec()
					.patch('/users/me')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.withBody(dto)
					.expectStatus(200)
					.expectBodyContains(dto.firstName)
					.expectBodyContains(dto.email);
			});
			it('should throw 404 if user not found', () => {
				return pactum
					.spec()
					.patch('/users/me')
					.withHeaders({
						Authorization: 'Bearer $S{userAtDel}',
					})
					.withBody(dto)
					.expectStatus(404)
			});
		});
		describe('GetMe', () => {
			it('should get current user', () => {
				return pactum
					.spec()
					.get('/users/me')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.expectStatus(200)
			});
			it('should throw 404 if user not found', () => {
				return pactum
					.spec()
					.get('/users/me')
					.withHeaders({
						Authorization: 'Bearer $S{userAtDel}',
					})
					.expectStatus(404)
			});
		});
		describe('updateProfileData', () => {
			const dto = {
				nick: "karisti"
			}
			it('should update user profile data', () => {
				return pactum
					.spec()
					.put('/users/profile')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.withBody(dto)
					.expectStatus(200)
					.expectBodyContains(dto.nick)
			});
			it('should throw 404 if user not found', () => {
				return pactum
					.spec()
					.put('/users/profile')
					.withHeaders({
						Authorization: 'Bearer $S{userAtDel}',
					})
					.withBody(dto)
					.expectStatus(404)
			});
			it('should throw 401 if jwt token not provided', () => {
				return pactum
					.spec()
					.put('/users/profile')
					.withHeaders({
						Authorization: '',
					})
					.withBody(dto)
					.expectStatus(401)
			});
		});
		describe('deleteProfilePicture', () => {
			it('should delete user profile picture', () => {
				return pactum
					.spec()
					.delete('/users/profile')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.expectBodyContains('default.jpg')
					.expectStatus(200)
			});
			it('should throw 404 if user not found', () => {
				return pactum
					.spec()
					.delete('/users/profile')
					.withHeaders({
						Authorization: 'Bearer $S{userAtDel}',
					})
					.expectStatus(404)
			});
			it('should throw 401 if jwt token not provided', () => {
				return pactum
					.spec()
					.delete('/users/profile')
					.withHeaders({
						Authorization: '',
					})
					.expectStatus(401)
			});
		});
	});
	describe('Uploads', () => {
		describe('serveImage', () => {
			it('should get user profile picture', () => {
				return pactum
					.spec()
					.get('/uploads/avatars/test')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.expectStatus(200)
			});
			it('should throw 404 if user not found', () => {
				return pactum
					.spec()
					.get('/uploads/avatars/test')
					.withHeaders({
						Authorization: 'Bearer $S{userAtDel}',
					})
					.expectStatus(404)
			});
			it('should throw 401 if jwt token not provided', () => {
				return pactum
					.spec()
					.get('/uploads/avatars/test')
					.withHeaders({
						Authorization: '',
					})
					.expectStatus(401)
			});
		});
	});
	
	describe('Bookmarks', () => {
		describe('CreateBookmark', () => {

		});
		describe('GetBookmarks', () => {

		});
		describe('GetBookmarkById', () => {

		});
		describe('EditBookmarkById', () => {

		});
		describe('DeleteBookmarkById', () => {

		});
	});
});
