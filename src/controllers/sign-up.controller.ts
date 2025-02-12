import { Request, Response } from "express";
import { dataSource } from "Src/database/data-source";
import { AppContext } from "Src/helpers/AppContext";
import { ConflictError } from "Src/helpers/Errors/ConflictError";
import { NotFoundError } from "Src/helpers/Errors/NotFoundError";
import { TeapotError } from "Src/helpers/Errors/TeapotError";
import { ValidationError } from "Src/helpers/Errors/ValidationError";
import { Jwt } from "Src/Services/Jwt";
import { Nodemailer } from "Src/Services/Nodemailer";
import { Otp } from "Src/Services/Otp";
import { z, ZodRawShape } from "zod";

export class SignUpController extends AppContext {
  private static async _index(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _show(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _store(request: Request, response: Response) {
    const queryRunner = dataSource.createQueryRunner();

    try {
      const { data: body, error } = z
        .object({
          name: z.string(),
          email: z.string().email(),
          phone: z.string().regex(/[0-9]{11}/),
          password: z.string(),
        })
        .safeParse(request.body);

      if (error) {
        throw new ValidationError(error.message, error.errors);
      }

      await queryRunner.startTransaction();

      let user = await this.userRepository.findOne({
        where: {
          email: body?.email,
        },
      });

      if (!user) {
        user = await this.userRepository.save(this.userRepository.create(body!));
      }

      const { otp, code } = await Otp.create({
        userId: user.id,
        type: "sign-up",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      });

      await Nodemailer.send({
        to: user.email,
        subject: "Confirmar registro de conta",
        html: `
				<p>Código OTP: ${code}</p>
			`,
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      response.status(200).json({
        message: "Cheque a caixa de entrada de seu email!",
        otp: {
          id: otp.id,
          expiresAt: otp.expiresAt,
        },
      });
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }

      throw error;
    }

    // const token = Jwt.sign({
    //   id: user.id,
    // });

    // response.status(200).json({ user, token });
  }

  private static async _update(request: Request, response: Response) {
    const queryRunner = dataSource.createQueryRunner();

    try {
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
        type: "sign-up",
      });

      if (!otpKey) throw new TeapotError("OTP expirado ou incorreto.");

      const user = await this.userRepository.findOne({
        where: {
          id: otpKey.userId,
        },
      });

      if (!user) throw new NotFoundError("Usuário não encontrado.");

      await queryRunner.startTransaction();

      await queryRunner.manager.save(
        this.userRepository.merge(user!, {
          isEmailConfirmed: true,
        })
      );
      await queryRunner.manager.remove(otpKey);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const token = Jwt.sign({
        id: user.id,
      });

      response.status(200).json({
        user,
        token,
      });
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }

      throw error;
    }
  }

  private static async _destroy(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  public static index = SignUpController._index.bind(AppContext);
  public static show = SignUpController._show.bind(AppContext);
  public static store = SignUpController._store.bind(AppContext);
  public static update = SignUpController._update.bind(AppContext);
  public static destroy = SignUpController._destroy.bind(AppContext);
}
