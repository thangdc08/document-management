import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  Code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  Name: string;

  @IsString()
  @IsOptional()
  Description?: string;
}