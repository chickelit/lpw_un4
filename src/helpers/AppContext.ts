import { dataSource } from "Src/database/data-source";
import { OtpKey } from "Src/database/entities/OtpKey.entity";
import { User } from "Src/database/entities/User.entity";

export class AppContext {
  public static readonly userRepository = dataSource.getRepository(User);
  public static readonly otpKeyRepository = dataSource.getRepository(OtpKey);
}
