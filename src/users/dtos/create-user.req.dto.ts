import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Expose } from 'class-transformer';
import { IUser } from '../../Interfaces/user.interface';
import { CreatePersonReqDto } from './create-person.dto';
export class CreateUserReqDto extends CreatePersonReqDto implements IUser {
  @IsNotEmpty()
  @IsEmail()
  mail: string;

  @IsString()
  pwd: string;

  id: number;

  /** Only these exposed properties will be included in the object received by the controller */
  @Expose()
  get email() {
    return this.mail;
  }

  @Expose()
  get password() {
    return this.pwd;
  }
}
