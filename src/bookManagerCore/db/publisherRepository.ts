import prisma from "../prismaClient.js";
import { toDBResponse } from "./dbResponse.utils.js";

export async function db_addPublisher(name: string) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.publisher.create({
        data: {
          name,
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

type UpdateParam = {
  name?: string;

  isDeleted?: boolean;
};

export async function db_updatePublisher(
  publisherId: string,
  update: UpdateParam
) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.publisher.update({
        where: { id: publisherId },
        data: {
          ...update,
        },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

export async function db_getPublishersByNameKeyword(keyword: string) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.publisher.findMany({
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

export async function dbRenamePublisher(id: string, name: string) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.publisher.update({
        where: {
          id,
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

export async function dbDeletePublisher(id: string) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.publisher.update({
        where: {
          id,
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
