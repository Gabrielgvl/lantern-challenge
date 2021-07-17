/*
  Warnings:

  - You are about to drop the column `isDeposit` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `type` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'EXCHANGE');

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "isDeposit",
ADD COLUMN     "type" "TransactionType" NOT NULL;
