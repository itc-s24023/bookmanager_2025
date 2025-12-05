import prisma from "../prismaClient.js";
import argon2 from "argon2";
import { toDBResponse } from "./dbResponse.utils.js";

export async function db_addUser(
  email: string,
  name: string,
  password: string
) {
  const hashedPassword = await argon2.hash(password);
  const data = await prisma
    .$transaction(async (tx) =>
      tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      })
    )
    .catch((err: Error) => err);

  return toDBResponse<typeof data>(data);
}

export async function db_getUserById(id: string) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.user.findUnique({
        where: { id },
      })
    )
    .catch((e: Error) => e);

  return toDBResponse<typeof data>(data);
}

export async function dbRenameUser(id: string, newName: string) {
  const data = await prisma
    .$transaction(async (tx) =>
      tx.user.update({
        where: {
          id,
          isDeleted: false,
        },
        data: { name: newName },
      })
    )
    .catch((err: Error) => err);

  return toDBResponse<typeof data>(data);
}
