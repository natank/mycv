import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IUser } from 'src/Interfaces/user.interface';
import { CreateUserReqDto } from './create-user.req.dto';

export class SigninReqDto implements IUser {
  @IsEmail()
  mail: string;

  @IsString()
  pwd: string;

  id: number;

  @Expose()
  get email() {
    return this.mail;
  }

  @Expose()
  get password() {
    return this.pwd;
  }
}
