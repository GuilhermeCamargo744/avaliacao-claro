import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListTeamsDto {
  @IsOptional()
  @IsString({ message: 'O termo de busca deve ser um texto' })
  search?: string;

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
