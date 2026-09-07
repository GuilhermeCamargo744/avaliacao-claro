import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateTeamDto {
  @IsString({ message: 'Nome deve ser um texto' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  name: string;

  @Matches(/^#[0-9a-fA-F]{6}$/, {
    message: 'Cor deve estar no formato #RRGGBB',
  })
  colorHex: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser um texto' })
  description?: string;
}
