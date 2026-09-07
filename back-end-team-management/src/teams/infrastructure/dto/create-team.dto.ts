import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateTeamDto {
  @IsString({ message: 'O nome deve ser um texto' })
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  name: string;

  @Matches(/^#[0-9a-fA-F]{6}$/, {
    message: 'A cor deve estar no formato #RRGGBB',
  })
  colorHex: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto' })
  description?: string;
}
