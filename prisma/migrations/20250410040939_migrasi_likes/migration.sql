-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "avatar" SET DEFAULT 'https://res.cloudinary.com/dn6uglajh/image/upload/v1733990935/blank-image_yfczs3.jpg';

-- CreateTable
CREATE TABLE "Likes" (
    "postId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" INTEGER NOT NULL,
    "postsId" INTEGER NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("postId","UserId")
);

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
