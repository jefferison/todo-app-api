import { IsNotEmpty, IsOptional } from 'class-validator';

export class TaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  userId: string;
}