import { Test, TestingModule } from '@nestjs/testing';
import { PersonasController } from './personas.controller';
import { PersonasService } from './personas.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PersonasController', () => {
  let controller: PersonasController;

  beforeEach(async () => {
    const prisma = {
      persona: {
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonasController],
      providers: [
        PersonasService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    controller = module.get<PersonasController>(PersonasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
