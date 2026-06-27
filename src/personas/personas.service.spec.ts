import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PersonasService } from './personas.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PersonasService', () => {
  let service: PersonasService;
  let prisma: {
    persona: {
      create: jest.Mock;
      findMany: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      persona: {
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonasService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PersonasService>(PersonasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create agrega una persona y le asigna un id', async () => {
    const dto = {
      nombre: 'Juan',
      rut: '12345678-9',
      fechaNacimiento: '1990-01-01',
      ciudad: 'Antofagasta',
      gustos: ['pizza', 'novelas'],
    };
    const creada = {
      id: 'uuid-1',
      ...dto,
      fechaNacimiento: new Date('1990-01-01'),
    };
    prisma.persona.create.mockResolvedValue(creada);

    const persona = await service.create(dto);

    expect(prisma.persona.create).toHaveBeenCalledWith({
      data: { ...dto, fechaNacimiento: new Date('1990-01-01') },
    });
    expect(persona.id).toBe('uuid-1');
    expect(persona.nombre).toBe('Juan');
  });

  it('findAll devuelve las personas agregadas', async () => {
    const personas = [
      { id: 'uuid-1', nombre: 'Juan' },
      { id: 'uuid-2', nombre: 'Ana' },
    ];
    prisma.persona.findMany.mockResolvedValue(personas);

    const result = await service.findAll();

    expect(prisma.persona.findMany).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].nombre).toBe('Juan');
    expect(result[1].nombre).toBe('Ana');
  });

  it('remove elimina una persona existente', async () => {
    const eliminada = { id: 'uuid-1', nombre: 'Juan' };
    prisma.persona.delete.mockResolvedValue(eliminada);

    const result = await service.remove('uuid-1');

    expect(prisma.persona.delete).toHaveBeenCalledWith({
      where: { id: 'uuid-1' },
    });
    expect(result.id).toBe('uuid-1');
  });

  it('remove lanza NotFoundException con id inexistente', async () => {
    const error = new Prisma.PrismaClientKnownRequestError('No encontrada', {
      code: 'P2025',
      clientVersion: '6.0.0',
    });
    prisma.persona.delete.mockRejectedValue(error);

    await expect(service.remove('id-inexistente')).rejects.toThrow(
      NotFoundException,
    );
  });
});
