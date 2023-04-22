import { IsEmail, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @Min(8)
  password: string;
}

export default CreateUserDto;
