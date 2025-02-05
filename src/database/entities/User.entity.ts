import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  phone!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: "boolean", default: false })
  isEmailConfirmed!: boolean;

  @Column()
  password!: string;
}
