/*
  Warnings:

  - The primary key for the `Likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserId` on the `Likes` table. All the data in the column will be lost.
  - You are about to drop the column `postsId` on the `Likes` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `Likes` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_postsId_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_usersId_fkey";

-- AlterTable
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_pkey",
DROP COLUMN "UserId",
DROP COLUMN "postsId",
DROP COLUMN "usersId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Likes_pkey" PRIMARY KEY ("userId", "postId");

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
