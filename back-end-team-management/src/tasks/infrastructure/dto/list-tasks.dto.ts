import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { TASK_STATUSES } from '../../domain/task.js';
import type { TaskStatus } from '../../domain/task.js';

const SORTABLE = ['createdAt', 'dueDate', 'title'] as const;

export class ListTasksDto {
  @IsOptional()
  @IsUUID('4', { message: 'O time deve ser identificado por um UUID válido' })
  teamId?: string;

  @IsOptional()
  @IsIn(TASK_STATUSES, {
    message: 'A situação deve ser pending, in_progress ou done',
  })
  status?: TaskStatus;

  @IsOptional()
  @IsString({ message: 'O termo de busca deve ser um texto' })
  search?: string;

  @IsOptional()
  @IsIn(SORTABLE, {
    message: 'A ordenação deve ser por createdAt, dueDate ou title',
  })
  sort: (typeof SORTABLE)[number] = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'A direção da ordenação deve ser asc ou desc',
  })
  order: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'A quantidade por página deve ser um número inteiro' })
  @Min(1, { message: 'A quantidade por página deve ser no mínimo 1' })
  @Max(100, { message: 'A quantidade por página deve ser no máximo 100' })
  limit = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O deslocamento da página deve ser um número inteiro' })
  @Min(0, { message: 'O deslocamento da página deve ser no mínimo 0' })
  offset = 0;
}
