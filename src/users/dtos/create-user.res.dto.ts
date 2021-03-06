import { Expose } from 'class-transformer';
import { IUserDto } from 'src/Interfaces/user.dto.interface';
import { User } from '../user.entity';
export class CreateUserResDto extends User implements IUserDto {
  @Expose()
  get mail() {
    return this.email;
  }

  get pwd() {
    return this.password;
  }
}
