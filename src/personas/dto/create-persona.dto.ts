import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreatePersonaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsDateString()
  fechaNacimiento: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;
}
