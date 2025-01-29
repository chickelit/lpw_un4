import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "mysql",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ["src/database/entities/**/*.{js,ts}"],
  subscribers: ["src/database/subscribers/**/*.{js,ts}"],
  synchronize: true,
});
