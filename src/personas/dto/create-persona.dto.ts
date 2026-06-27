import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  gustos?: string[];
}
