import { Request, Response } from "express";
import { User } from "Src/database/entities/User.entity";
import { AppContext } from "Src/helpers/AppContext";
import { ConflictError } from "Src/helpers/Errors/ConflictError";
import { ValidationError } from "Src/helpers/Errors/ValidationError";
import { Jwt } from "Src/Services/Jwt";
import { z, ZodRawShape } from "zod";

export class SignUpController extends AppContext {
  private static async _index(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _show(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _store(request: Request, response: Response) {
    const { data: body, error } = z
      .object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
      .safeParse(request.body);

    if (error) {
      throw new ValidationError(error.message, error.errors);
    }

    const isEmailInUse = await this.userRepository.exists({
      where: {
        email: body?.email,
      },
    });

    if (isEmailInUse) throw new ConflictError("Este email já está em uso.");

    const user = await this.userRepository.save(this.userRepository.create(body!));
    const token = Jwt.sign({
      id: user.id,
    });

    response.status(200).json({ user, token });
  }

  private static async _update(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
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
