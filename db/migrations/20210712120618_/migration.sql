-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "waletId" TEXT;

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("waletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
