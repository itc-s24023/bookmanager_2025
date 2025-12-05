import prisma from "../prismaClient.js";
import { toDBResponse } from "./dbResponse.utils.js";

export async function db_addBook(
  isbn: number,
  title: string,
  authorId: string,
  publisherId: string,
  publicationYear: number,
  publicationMonth: number
) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.book.create({
        data: {
          isbn,
          title,
          authorId,
          publisherId,
          publicationYear,
          publicationMonth,
        },
      })
    )
    .catch((e: Error) => e);

  const db_data = toDBResponse<typeof data>(data);

  if (!db_data.ok && db_data.data?.code === "P2002") {
    //既に書籍が存在する場合
    const data = await prisma
      .$transaction(
        async (
          tx //削除されている場合は情報を上書きして復活させる
        ) =>
          tx.book.update({
            where: {
              isbn,
              isDeleted: true,
            },
            data: {
              isDeleted: false,
            },
          })
      )
      .catch((e: Error) => e);

    const update = toDBResponse<typeof data>(data);
    if (update.ok) return update;

    return db_data;
  }

  return db_data;
}

export async function db_getBooks(skip: number, take: number) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.book.findMany({
        skip,
        take,
        where: {
          isDeleted: false,
        },
        orderBy: [{ publicationYear: "desc" }, { publicationMonth: "desc" }],
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

export async function db_getBookDetail(isbn: number) {
  const data = await prisma.$transaction(async (tx) =>
    tx.book
      .findUnique({
        where: {
          isbn,
          isDeleted: false,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
          publisher: {
            select: {
              name: true,
            },
          },
        },
      })
      .catch((e: Error) => e)
  );

  return toDBResponse<typeof data>(data);
}

type updateParam = {
  title?: string;
  authorId?: string;
  publisherId?: string;
  publicationYear?: number;
  publicationMonth?: number;
  isDeleted?: boolean;
};
export async function db_updateBook(isbn: number, update: updateParam) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.book.update({
        where: {
          isbn,
          isDeleted: false,
        },
        data: {
          ...update,
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

export async function db_getBookWithRentalLog(
  isbn: number,
  returnedOnly: boolean = false
) {
  const data = await prisma.$transaction(async (tx) =>
    tx.book.findUnique({
      where: { isbn },
      include: {
        rentalLogs: {
          where: {
            returnedDate: returnedOnly ? null : undefined,
          },
        },
      },
    })
  );

  return toDBResponse<typeof data>(data);
}

export async function dbDeleteBook(isbn: number) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.book.update({
        where: {
          isbn,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}
