import { IsEmail, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
export class CreateUserReqDto {
  @IsEmail()
  mail: string;

  @IsString()
  pwd: string;

  @Expose()
  get email() {
    return this.mail;
  }

  @Expose()
  get password() {
    return this.pwd;
  }
}
