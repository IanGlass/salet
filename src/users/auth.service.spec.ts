import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'testpass');
    expect(user.password).not.toEqual('testpass');
  });

  it('should throw error for signup with existing email', async () => {
    jest.spyOn(fakeUsersService, 'find').mockImplementation(() =>
      Promise.resolve([
        {
          id: 1,
          email: 'test@test.com',
          password: '1',
        } as User,
      ]),
    );
    expect(service.signup('test@test.com', 'testpass')).rejects.toThrow(
      'Email in use',
    );
  });

  it('should throw error if login is called with non-existing email', async () => {
    expect(service.login('test@test.com', 'testpass')).rejects.toThrow(
      'Incorrect email or password',
    );
  });

  it('should throw error if login is called with incorrect password', async () => {
    jest.spyOn(fakeUsersService, 'find').mockImplementation(() =>
      Promise.resolve([
        {
          id: 1,
          email: 'test@test.com',
          password: '123',
        } as User,
      ]),
    );

    expect(service.login('test@test.com', 'testpass')).rejects.toThrow(
      'Incorrect email or password',
    );
  });

  it('should return user for correct login credentials', async () => {
    const password = 'test@test.com';

    jest.spyOn(fakeUsersService, 'find').mockImplementation(async () => {
      const hash = await bcrypt.hash(password, 10);

      return Promise.resolve([
        {
          id: 1,
          email: 'test@test.com',
          password: hash,
        } as User,
      ]);
    });

    const user = await service.login('test@test.com', password);

    expect(user).toBeDefined();
  });
});
