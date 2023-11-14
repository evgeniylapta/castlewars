/*
  Warnings:

  - Added the required column `dateTime` to the `Attack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attack" ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL;
