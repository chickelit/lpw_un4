import jwt from "jsonwebtoken";

interface JwtData {
  id: string;
}

export class Jwt {
  public static tokenSecret = process.env.JWT_TOKEN_SECRET!;

  public static sign(payload: JwtData) {
    const token = jwt.sign(payload, this.tokenSecret, {
      expiresIn: "30d",
    });

    return token;
  }

  public static verify(token: string) {
    const data = jwt.verify(token, this.tokenSecret) as JwtData;

    return data;
  }
}
