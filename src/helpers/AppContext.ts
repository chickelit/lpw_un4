import { dataSource } from "Src/database/data-source";
import { User } from "Src/database/entities/User.entity";

export class AppContext {
  public static readonly userRepository = dataSource.getRepository(User);
}
