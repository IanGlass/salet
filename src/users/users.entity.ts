import { IsEmail } from 'class-validator';
import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/reports.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Updated user with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id ', this.id);
  }
}
