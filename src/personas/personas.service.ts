import { Injectable, NotFoundException } from '@nestjs/common';
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

  remove(id: string): Persona {
    const index = this.personas.findIndex((persona) => persona.id === id);
    if (index === -1) {
      throw new NotFoundException(`Persona con id ${id} no encontrada`);
    }
    const [persona] = this.personas.splice(index, 1);
    return persona;
  }
}
