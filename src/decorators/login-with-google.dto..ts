import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginWithGoogleDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly firebaseUid: string;
}
