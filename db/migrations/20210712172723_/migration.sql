/*
  Warnings:

  - A unique constraint covering the columns `[currencyId,walletId]` on the table `AmountWallet` will be added. If there are existing duplicate values, this will fail.
  - Made the column `walletId` on table `AmountWallet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AmountWallet" ALTER COLUMN "walletId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AmountWallet.currencyId_walletId_unique" ON "AmountWallet"("currencyId", "walletId");
