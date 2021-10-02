import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { PersonalDetailsDto } from './personalDetails.dto';
export class CreatePersonReqDto {
  @Expose()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => {
    return PersonalDetailsDto;
  })
  personalDetails: PersonalDetailsDto;
}
