// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';

// describe('AppController (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';

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
		});

	});
	describe('User', () => {
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
		});
		describe('EditUser', () => {
			const dto: EditUserDto = {
				firstName: "Miki",
				email: "miki@42mars.com"
			}
			it('should edit user', () => {
				return pactum
					.spec()
					.patch('/users')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.withBody(dto)
					.expectStatus(200)
					.expectBodyContains(dto.firstName)
					.expectBodyContains(dto.email);
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
