import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { Persona } from './entities/persona.entity';

@Injectable()
export class PersonasService {
  private personas: Persona[] = [];

  create(dto: CreatePersonaDto): Persona {
    const persona: Persona = {
      id: randomUUID(),
      nombre: dto.nombre,
      rut: dto.rut,
      fechaNacimiento: dto.fechaNacimiento,
      ciudad: dto.ciudad,
    };
    this.personas.push(persona);
    return persona;
  }

  findAll(): Persona[] {
    return this.personas;
  }
}
