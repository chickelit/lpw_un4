import { Request, Response } from "express";
import { AppContext } from "Src/helpers/AppContext";
import { ConflictError } from "Src/helpers/Errors/ConflictError";
import { NotFoundError } from "Src/helpers/Errors/NotFoundError";
import { TeapotError } from "Src/helpers/Errors/TeapotError";
import { ValidationError } from "Src/helpers/Errors/ValidationError";
import { Bcrypt } from "Src/Services/Bcrypt";
import { Jwt } from "Src/Services/Jwt";
import { Nodemailer } from "Src/Services/Nodemailer";
import { Otp } from "Src/Services/Otp";
import { z } from "zod";

export class SignInController extends AppContext {
  private static async _show(request: Request, response: Response) {
    response.status(200).json({
      user: request.auth!.user,
    });
  }

  private static async _store(request: Request, response: Response) {
    const { data: body, error } = z
      .object({
        email: z.string().email(),
        password: z.string(),
      })
      .safeParse(request.body);

    if (error) throw new ValidationError(error.message, error.errors);

    const user = await this.userRepository.findOne({
      where: {
        email: body?.email,
      },
    });

    if (user && !user.isEmailConfirmed) throw new ConflictError("Confirme seu email antes de fazer login.");
    if (!user || !Bcrypt.compare(body!.password, user.password)) throw new TeapotError("Credenciais incorretas.");

    const { otp, code } = await Otp.create({
      userId: user.id,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      type: "sign-in",
    });
    console.log(otp);
    await Nodemailer.send({
      to: user.email,
      subject: "Código de segurança de login",
      html: `
						<p>Código OTP: ${code}</p>
					`,
    });

    response.status(200).json({
      otp: {
        id: otp.id,
        expiresAt: otp.expiresAt,
      },
    });
    // const token = Jwt.sign({
    //   id: user.id,
    // });

    // response.status(200).json({
    //   user,
    //   token,
    // });
  }

  private static async _update(request: Request, response: Response) {
    const { data: body, error } = z
      .object({
        otpId: z.string(),
        code: z.string().regex(/[0-9]{6}/),
      })
      .safeParse(request.body);

    if (error) {
      throw new ValidationError(error.message, error.errors);
    }

    const otpKey = await Otp.verify({
      id: body.otpId,
      code: body.code,
      type: "sign-in",
    });

    if (!otpKey) throw new TeapotError("OTP expirado ou incorreto.");

    const user = await this.userRepository.findOne({
      where: {
        id: otpKey.userId,
      },
    });

    if (!user) throw new NotFoundError("Usuário não encontrado.");

    const token = Jwt.sign({
      id: user.id,
    });

    response.status(200).json({
      user,
      token,
    });
  }

  public static show = SignInController._show.bind(AppContext);
  public static store = SignInController._store.bind(AppContext);
  public static update = SignInController._update.bind(AppContext);
}
