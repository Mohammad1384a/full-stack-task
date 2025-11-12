import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsDateString,
  IsIn,
  IsOptional,
} from 'class-validator';
import type { TaskStatus } from '../task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsUUID()
  assigneeId: string;

  @IsIn(['todo', 'in_progress', 'done', 'blocked'])
  status: TaskStatus;
}
