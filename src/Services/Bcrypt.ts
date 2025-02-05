import bcrypt from "bcrypt";

export class Bcrypt {
  static hash(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  static compare(trial: string | Buffer, target: string) {
    return bcrypt.compareSync(trial, target);
  }
}
