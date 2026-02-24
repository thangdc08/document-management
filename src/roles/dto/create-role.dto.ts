import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  Code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  Name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  Description?: string;
}