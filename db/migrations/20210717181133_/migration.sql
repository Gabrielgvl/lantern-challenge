/*
  Warnings:

  - You are about to drop the column `amount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `convertedAmount` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `resultAmount` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount",
DROP COLUMN "convertedAmount",
ADD COLUMN     "resultAmount" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "fromCurrencyId" DROP NOT NULL;
