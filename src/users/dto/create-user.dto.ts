import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @Length(8, 24)
  password: string

  @IsNotEmpty()
  @IsString()
  fullname: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  phone: string
}
