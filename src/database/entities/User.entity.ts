import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  phone!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;
}
