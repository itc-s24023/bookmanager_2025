-- AlterTable
ALTER TABLE "Author" ALTER COLUMN "id" SET DEFAULT uuidv7();

-- AlterTable
ALTER TABLE "Publisher" ALTER COLUMN "id" SET DEFAULT uuidv7();

-- AlterTable
ALTER TABLE "RentalLog" ALTER COLUMN "id" SET DEFAULT uuidv7();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT uuidv7();
