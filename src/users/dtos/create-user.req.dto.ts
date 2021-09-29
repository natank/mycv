import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { IUser } from '../../Interfaces/user.interface';

export class CreateUserReqDto implements IUser {
  @IsNotEmpty()
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
