import { env_config } from "../../bookManagerConfig/environment.js";
import prisma from "../prismaClient.js";
import { toDBResponse } from "./dbResponse.utils.js";

export async function db_getRentallogById(id: string) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.rentalLog.findUnique({
        where: { id },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

export async function db_getRentalLogByUserId(userId: string) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.rentalLog.findMany({
        where: { userId },
        select: {
          id: true,
          book: {
            select: {
              isbn: true,
              title: true,
            },
          },
          checkoutDate: true,
          dueDate: true,
          returnedDate: true,
        },
        orderBy: {
          checkoutDate: "desc",
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

export async function db_getRentalLogByBookIsbn(
  isbn: number,
  returnedOnly: boolean = false
) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.rentalLog.findMany({
        where: {
          bookIsbn: isbn,
          returnedDate: returnedOnly ? null : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          checkoutDate: "desc",
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

type FilterParam = {
  userId?: string;
  bookIsbn?: number;
  returnedOnly?: boolean;
};

export async function db_getRentalLogs(filter: FilterParam) {
  const { userId, bookIsbn, returnedOnly } = filter;
  const data = await prisma
    .$transaction(async (tx) =>
      tx.rentalLog.findMany({
        where: {
          userId: userId,
          bookIsbn: bookIsbn,
          returnedDate: returnedOnly ? null : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          book: true,
        },
        orderBy: {
          checkoutDate: "desc",
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

export async function db_findRentalLog(filter: FilterParam) {
  const { userId, bookIsbn, returnedOnly } = filter;
  const data = await prisma
    .$transaction(async (tx) =>
      tx.rentalLog.findFirst({
        where: {
          userId: userId,
          bookIsbn: bookIsbn,
          returnedDate: returnedOnly ? null : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          book: true,
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

export async function db_addRentalLog(userId: string, isbn: number) {
  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + env_config.APP_DUE_DAYS);
  const data = await prisma
    .$transaction(async (tx) =>
      tx.rentalLog.create({
        data: {
          userId,
          bookIsbn: isbn,
          checkoutDate: now,
          dueDate: dueDate,
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

type UpdateParams = {
  returnedDate?: Date | null;
};
export async function dbUpdateRentalLog(id: string, params: UpdateParams) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.rentalLog.update({
        where: { id },
        data: {
          ...params,
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

export async function dbReturnRentalLog(id: string, userId: string) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.rentalLog.update({
        where: {
          id,
          userId,
          returnedDate: null,
        },
        data: {
          returnedDate: new Date(),
        },
        select: {
          id: true,
          returnedDate: true,
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}
