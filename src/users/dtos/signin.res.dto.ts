import { Expose } from 'class-transformer';
import { IUserDto } from 'src/Interfaces/user.dto.interface';
import { User } from '../user.entity';
export class SigninResDto extends User implements IUserDto {
  // Fields that exist in the base class are exposed directly
  @Expose()
  id;

  // Fields that not exist in the base class, or should have a different name, will be expose using a getter
  @Expose()
  get mail() {
    return this.email;
  }

  get pwd() {
    return this.password;
  }
}
