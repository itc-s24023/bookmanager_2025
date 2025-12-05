import prisma from "../prismaClient.js";
import { toDBResponse } from "./dbResponse.utils.js";

export async function db_addAuthor(name: string) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.author.create({
        data: {
          name,
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

type UpdateParam = {
  isDeleted?: boolean;
  name?: string;
};

export async function db_updateAuthor(authorId: string, update: UpdateParam) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.author.update({
        where: {
          id: authorId,
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

export async function dbRenameAuthor(authorId: string, name: string) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.author.update({
        where: {
          id: authorId,
          isDeleted: false,
        },
        data: {
          name: name,
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

export async function dbDeleteAuthor(authorId: string) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.author.update({
        where: {
          id: authorId,
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

export async function db_getAuthorsByNameKeyword(keyword: string) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.author.findMany({
        where: {
          isDeleted: false,
          name: {
            contains: keyword,
          },
        },
        select: {
          id: true,
          name: true,
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}
