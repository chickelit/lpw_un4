import { OtpKey } from "Src/database/entities/OtpKey.entity";
import { AppContext } from "Src/helpers/AppContext";
import { Bcrypt } from "./Bcrypt";
import { Transaction } from "typeorm";

export class Otp extends AppContext {
  private static generateOtp(length = 6) {
    return Math.floor(Math.random() * 10 ** length)
      .toString()
      .padStart(length, "0");
  }

  public static async create(partialOtp: Pick<OtpKey, "userId" | "expiresAt" | "type">) {
    const code = this.generateOtp();
    const otp = await this.otpKeyRepository.save(
      this.otpKeyRepository.create({
        code: Bcrypt.hash(code),
        ...partialOtp,
      })
    );

    return { otp, code };
  }

  public static async verify(partialOtp: Pick<OtpKey, "id" | "type" | "code">) {
    const otpKey = await this.otpKeyRepository.findOne({
      where: {
        id: partialOtp.id,
        type: partialOtp.type,
      },
    });
		console.log(otpKey)

    if (!otpKey) return;
    console.log(otpKey.expiresAt.getTime(), Date.now());
    if (otpKey.expiresAt.getTime() < Date.now()) {
      await this.otpKeyRepository.manager.remove(otpKey);

      return;
    }

    const isValid = Bcrypt.compare(partialOtp.code, otpKey.code);

    if (!isValid) return;

    return otpKey;
  }
}
