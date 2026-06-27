import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PersonasService } from './personas.service';

describe('PersonasService', () => {
  let service: PersonasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonasService],
    }).compile();

    service = module.get<PersonasService>(PersonasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create agrega una persona y le asigna un id', () => {
    const persona = service.create({
      nombre: 'Juan',
      rut: '12345678-9',
      fechaNacimiento: '1990-01-01',
      ciudad: 'Antofagasta',
      gustos: ['pizza', 'novelas'],
    });

    expect(persona.id).toBeDefined();
    expect(typeof persona.id).toBe('string');
    expect(persona.nombre).toBe('Juan');
  });

  it('findAll devuelve las personas agregadas', () => {
    service.create({
      nombre: 'Juan',
      rut: '12345678-9',
      fechaNacimiento: '1990-01-01',
      ciudad: 'Antofagasta',
      gustos: ['pizza', 'novelas'],
    });
    service.create({
      nombre: 'Ana',
      rut: '98765432-1',
      fechaNacimiento: '1995-05-05',
      ciudad: 'Santiago',
      gustos: ['ajedrez'],
    });

    const personas = service.findAll();

    expect(personas).toHaveLength(2);
    expect(personas[0].nombre).toBe('Juan');
    expect(personas[1].nombre).toBe('Ana');
  });

  it('remove elimina una persona existente', () => {
    const persona = service.create({
      nombre: 'Juan',
      rut: '12345678-9',
      fechaNacimiento: '1990-01-01',
      ciudad: 'Antofagasta',
      gustos: ['pizza', 'novelas'],
    });

    const eliminada = service.remove(persona.id);

    expect(eliminada.id).toBe(persona.id);
    expect(service.findAll()).toHaveLength(0);
  });

  it('remove lanza NotFoundException con id inexistente', () => {
    expect(() => service.remove('id-inexistente')).toThrow(NotFoundException);
  });

  it('create guarda los gustos de la persona', () => {
    const persona = service.create({
      nombre: 'Juan',
      rut: '12345678-9',
      fechaNacimiento: '1990-01-01',
      ciudad: 'Antofagasta',
      gustos: ['pizza', 'novelas', 'videojuegos'],
    });

    expect(persona.gustos).toEqual(['pizza', 'novelas', 'videojuegos']);

    const sinGustos = service.create({
      nombre: 'Ana',
      rut: '98765432-1',
      fechaNacimiento: '1995-05-05',
      ciudad: 'Santiago',
    });

    expect(sinGustos.gustos).toEqual([]);
  });
});
