/*
  Warnings:

  - The primary key for the `Tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Tasks` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `updated_at` to the `Tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_ownerId_fkey";

-- AlterTable
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "ownerId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "inbox_taskId" TEXT,
ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Tasks_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "InboxTasks" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'Inbox',
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "InboxTasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InboxTasks_ownerId_key" ON "InboxTasks"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_ownerId_key" ON "Projects"("ownerId");

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_inbox_taskId_fkey" FOREIGN KEY ("inbox_taskId") REFERENCES "InboxTasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboxTasks" ADD CONSTRAINT "InboxTasks_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
