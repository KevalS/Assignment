import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as shortid from 'shortid';

@Entity()
export class User {
  @PrimaryColumn('varchar', { length: 16 })
  id!: string;
  @BeforeInsert()
  setId() {
    this.id = shortid.generate();
  }
  @Column({ type: 'varchar', length: 500 })
  name!: string;

  @Column({ type: 'varchar', length: 500, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 500 })
  @Exclude({ toPlainOnly: true })
  password!: string;

  @Column({ type: 'varchar', length: 13, nullable: true })
  phone!: string;

  @Column({ type: 'varchar', length: 13, nullable: true })
  type!: string;

  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
