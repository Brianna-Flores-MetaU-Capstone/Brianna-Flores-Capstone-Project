-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "editingAuthor" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "originalSource" TEXT NOT NULL DEFAULT '';
