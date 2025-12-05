-- DropIndex
DROP INDEX "author_name_key";

-- CreateIndex
CREATE INDEX "author_name_idx" ON "author"("name");

-- CreateIndex
CREATE INDEX "publisher_name_idx" ON "publisher"("name");
