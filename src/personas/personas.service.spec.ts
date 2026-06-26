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
    });

    expect(persona.id).toBeDefined();
    expect(typeof persona.id).toBe('string');
    expect(persona.nombre).toBe('Juan');
  });
});
