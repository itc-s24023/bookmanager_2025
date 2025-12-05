import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js"; 
import { env_config } from "../bookManagerConfig/environment.js";

const url = String(env_config.DATABASE_URL);
const params =
  url.match(
    /^(?<provider>.+?):\/\/(?<user>.+?):(?<password>.+?)@(?<host>.+?):(?<port>\d+)\/(?<database>.+?)$/
  )?.groups || {};

const adapter = new PrismaPg({
  user: params.user,
  password: params.password,
  host: params.host,
  port: Number(params.port),
  database: params.database,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export default prisma;
