import { Request, Response } from "express";
import { AppContext } from "Src/helpers/AppContext";
import { TeapotError } from "Src/helpers/Errors/TeapotError";
import { Bcrypt } from "Src/Services/Bcrypt";
import { Jwt } from "Src/Services/Jwt";
import { z } from "zod";

export class SignInController extends AppContext {
  private static async _store(request: Request, response: Response) {
    const { data: body, error } = z
      .object({
        email: z.string().email(),
        password: z.string(),
      })
      .safeParse(request.body);

    const user = await this.userRepository.findOne({
      where: {
        email: body?.email,
      },
    });

    if (!user || !Bcrypt.compare(body!.password, user.password))
      throw new TeapotError("Credenciais incorretas.");

    const token = Jwt.sign({
      id: user.id,
    });

    response.status(200).json({
      user,
      token,
    });
  }

  private static async _show(request: Request, response: Response) {
    response.status(200).json({
      user: request.auth!.user,
    });
  }

  public static show = SignInController._show.bind(AppContext);
  public static store = SignInController._store.bind(AppContext);
}
