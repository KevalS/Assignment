export class TaskCreateDto {
  title!: string;
  description!: string;
  dueDate!: string;
  userId!: string;
  priority?: number;
  status!: string;
}

export class TaskUpdateDto {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: number;
  status?: string;
}
