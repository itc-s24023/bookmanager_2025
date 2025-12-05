import { env_config } from "../../bookManagerConfig/environment.js";
import { PrismaClientKnownRequestError } from "../../generated/prisma/internal/prismaNamespace.js";

type db_Response<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      data?: PrismaClientKnownRequestError & {
        meta?: {
          target: string[];
        };
      };
    };

/**
 * db_系関数のレスポンスを統一する
 * @param data
 * @returns
 */
export function toDBResponse<T>(
  data: T | Error
): db_Response<Exclude<T, Error>> {
  const isError = data instanceof Error;
  const isPrismaClientKnownRequestError =
    data instanceof PrismaClientKnownRequestError;
  if (env_config.SHOW_DB_ERRORS && isError) console.error(data);
  return isPrismaClientKnownRequestError
    ? {
        ok: false,
        data: data as PrismaClientKnownRequestError & {
          meta?: { target: string[] };
        },
      }
    : isError
    ? {
        ok: false,
      }
    : {
        ok: true,
        data: data as Exclude<T, Error>,
      };
}
