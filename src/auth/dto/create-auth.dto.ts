import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateAuthDto {
  @IsString()
  @IsNotEmpty({
    message: 'name is required',
  })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A minimum 8 characters password contains a combination of uppercase and lowercase letter and number.',
  })
  password: string;
}
