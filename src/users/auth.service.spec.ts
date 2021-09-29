import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { IUser } from 'src/Interfaces/user.interface';

describe('AuthService', () => {
  let service: AuthService;
  const users: User[] = [];
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: ({ email, password }: IUser) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        };
        users.push(user as User);
        return Promise.resolve(user as User);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup({
      email: 'asdf@asdf.com',
      password: 'asdf',
    });
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it(`throws an erro if user signs up with email this is in use`, async (done) => {
    const email = 'asdfggg@asdf.com',
      password = 'asdf';
    await service.signup({ email, password });
    try {
      await service.signup({ email, password });
    } catch (error) {
      done();
    }
  });
  it(`throws an error if sigin is called with an unused email address`, async (done) => {
    try {
      await service.signin({
        email: 'asdf@asdfasldfkjfd@sadf.com',
        password: 'pasdfldkj',
      });
    } catch (error) {
      done();
    }
  });
  it('throws if an invalid password is provided', async (done) => {
    const email = 'hhhh@fjfjf.com',
      password = 'pasdfldkj';
    await service.signup({ email, password });
    try {
      await service.signin({
        email,
        password: password + 'kdkdkdk',
      });
    } catch (error) {
      done();
    }
  });
  it('returns a user if correct password is provided', async () => {
    const email = 'asdfl@sdflkj.com',
      password = 'fdsffds';
    await service.signup({ email, password });
    const user = await service.signin({ email, password });
    expect(user).toBeDefined();
  });
});
