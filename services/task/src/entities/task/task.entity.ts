import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import * as shortid from 'shortid';

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

@Entity()
export class Task {
  @PrimaryColumn('varchar', { length: 16 })
  id!: string;
  @BeforeInsert()
  setId() {
    this.id = shortid.generate();
  }

  @Column({ type: 'varchar', nullable: false, length: 50 })
  userId!: string;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'varchar', length: 500 })
  description!: string;

  @Column({ type: 'integer', nullable: true })
  priority!: string;

  @Column({ type: 'enum', enum: TaskStatus })
  status!: string;

  @CreateDateColumn()
  dueDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
