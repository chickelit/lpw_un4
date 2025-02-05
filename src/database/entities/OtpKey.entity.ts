import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class OtpKey {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId?: string;

  @Column()
  code!: string;

  @Column()
  type!: "sign-up" | "sign-in";

  @Column()
  expiresAt!: Date;
}
