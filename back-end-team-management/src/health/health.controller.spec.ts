import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  let ping: () => Promise<void>;
  let controller: HealthController;

  beforeEach(async () => {
    ping = async () => {};
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: { ping: () => ping() } }],
    }).compile();

    controller = module.get(HealthController);
  });

  it('devolve ok quando o banco responde', async () => {
    await expect(controller.check()).resolves.toEqual({ status: 'ok' });
  });

  it('responde 503 quando o banco falha', async () => {
    ping = async () => {
      throw new Error('ECONNREFUSED');
    };

    await expect(controller.check()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
