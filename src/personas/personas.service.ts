import { Injectable } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { Persona } from './entities/persona.entity';

@Injectable()
export class PersonasService {
  private personas: Persona[] = [];

  create(createPersonaDto: CreatePersonaDto) {
    return 'This action adds a new persona';
  }

  findAll() {
    return `This action returns all personas`;
  }

  remove(id: number) {
    return `This action removes a #${id} persona`;
  }
}
