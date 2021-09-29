import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { SigninResDto } from './dtos/signin.res.dto';
import { SigninReqDto } from './dtos/signin.req.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      // return the same user
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@example.com',
          password: 'kdkdkdk',
        } as User);
      },
      // return a user with the appropriate id
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },
      // return boolean
      // remove: () => {},
      // // return updated user
      // update: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: ({ email, password }) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findAllUsers returns a list of users with the given email', async () => {
    const email = 'asdf@asdf.com';
    const users = await controller.findAllUsers(email);
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(email);
  });
  it('findUser returns single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user id is not found', async (done) => {
    fakeUsersService.findOne = () => null;
    try {
      await controller.findUser('1');
    } catch (error) {
      done();
    }
  });

  it('signin updates session object and returns user id', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'user@example.com', password: 'asdf' } as SigninReqDto,
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
