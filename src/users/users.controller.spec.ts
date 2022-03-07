import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'testpass',
        } as User),
      find: (email: string) =>
        Promise.resolve([
          {
            id: 1,
            email,
            password: 'testpass',
          } as User,
        ]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    fakeAuthService = {
      login: (email: string, password: string) =>
        Promise.resolve({
          id: 1,
          email: 'test@test.com',
          password: 'testpass',
        } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return list of users for test@test.com', async () => {
    const users = await controller.findAllUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('should return a single user for the given userId', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('login updates session object and returns user', async () => {
    const session = { userId: null };
    const user = await controller.login(
      {
        email: 'test@test.com',
        password: 'testpass',
      },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
