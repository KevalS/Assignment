import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum StatusType {
  ANDROID = 'pending',
  IOS = 'completed',
}

export class PermissionsDto {
  @ApiProperty({ description: 'Id of the permission', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id!: number;
}
export class CreateTaskDto {
  @ApiProperty({ description: 'Task Name', example: 'Test Task' })
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Task Description',
    required: false,
    example: 'To manage',
  })
  @IsOptional()
  description!: string;

  @ApiProperty({
    description: 'User ID',
    required: true,
    example: '72XRZVieK',
  })
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({
    description: 'Task Status',
    required: true,
    example: 'pending',
  })
  @IsNotEmpty()
  status!: string;

  @ApiProperty({
    description: 'Task priority',
    required: false,
    example: 1,
    type: 'number',
  })
  @IsOptional()
  priority!: number;

  @ApiProperty({
    description: 'Due Date',
    required: false,
    example: '2023-12-02T10:41:37.365Z',
    type: 'string',
  })
  @IsOptional()
  dueDate!: number;
}

export class UpdateTaskDto {
  @ApiProperty({ description: 'Task Name', example: 'Staff' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Task Description',
    required: false,
    example: 'To manage',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Task priority',
    required: false,
    example: 1,
    type: 'number',
  })
  @IsOptional()
  priority!: number;

  @ApiProperty({
    description: 'Due Date',
    required: false,
    example: '',
    type: 'string',
  })
  @IsOptional()
  dueDate!: number;
}
export class UpdateTaskStatusDto {
  @ApiProperty({ enum: ['completed', 'pending'] })
  @IsEnum(StatusType)
  @IsString()
  @IsNotEmpty()
  status!: string;
}
