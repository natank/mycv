import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserReqDto } from './dtos/create-user.req.dto';
import { CreateUserResDto } from './dtos/create-user.res.dto';
import { SigninReqDto } from './dtos/signin.req.dto';
import { SigninResDto } from './dtos/signin.res.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Serialize(CreateUserReqDto)
  @Post('/signup')
  async createUser(
    @Body() body: CreateUserReqDto,
    @Session() session: any,
  ): Promise<CreateUserResDto> {
    try {
      const userEntity = await this.authService.signup(body);
      session.userId = userEntity.id;

      const createUserResDto = createResponseDto<CreateUserResDto>(
        CreateUserResDto,
        userEntity,
      );

      return createUserResDto;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Serialize(SigninReqDto)
  @Post('/signin')
  async signin(
    @Body() body: SigninReqDto,
    @Session() session: any,
  ): Promise<SigninResDto> {
    const user = await this.authService.signin(body);
    const signinResDto: SigninResDto = createResponseDto<SigninResDto>(
      SigninResDto,
      user,
    );
    session.userId = user.id;
    return signinResDto;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Serialize(CreateUserReqDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id, 10));
    console.log('handler is running');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id, 10));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: CreateUserReqDto) {
    return this.usersService.update(parseInt(id, 10), body);
  }
}

// Create response dto from user entity
function createResponseDto<T>(ResDtoClass, entity): T {
  let resDto: T = new ResDtoClass();
  resDto = Object.assign(resDto, entity);
  return resDto;
}
