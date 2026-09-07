import {
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { TASK_STATUSES } from '../../domain/task.js';
import type { TaskStatus } from '../../domain/task.js';

export class CreateTaskDto {
  @IsString({ message: 'O título deve ser um texto' })
  @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres' })
  title: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto' })
  description?: string;

  @IsOptional()
  @IsIn(TASK_STATUSES, {
    message: 'A situação deve ser pending, in_progress ou done',
  })
  status?: TaskStatus;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'A data de entrega deve estar no formato ISO-8601' },
  )
  dueDate?: string;

  @IsOptional()
  @IsUUID('4', {
    each: true,
    message: 'Cada time deve ser identificado por um UUID válido',
  })
  @IsArray({ message: 'Os times devem ser enviados em uma lista' })
  teamIds?: string[];
}
