import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonaDto } from './dto/create-persona.dto';

@Injectable()
export class PersonasService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePersonaDto) {
    return this.prisma.persona.create({
      data: {
        ...dto,
        fechaNacimiento: new Date(dto.fechaNacimiento),
      },
    });
  }

  findAll() {
    return this.prisma.persona.findMany();
  }

  async remove(id: string) {
    try {
      return await this.prisma.persona.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Persona con id ${id} no encontrada`);
      }
      throw error;
    }
  }
}
