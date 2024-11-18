/*
  Warnings:

  - You are about to drop the column `lora_amount` on the `Lora` table. All the data in the column will be lost.
  - You are about to drop the column `lora_id` on the `Lora` table. All the data in the column will be lost.
  - You are about to drop the column `lora_limit` on the `Lora` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[request_id]` on the table `Lora` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `request_id` to the `Lora` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Lora_lora_id_key";

-- AlterTable
ALTER TABLE "Lora" DROP COLUMN "lora_amount",
DROP COLUMN "lora_id",
DROP COLUMN "lora_limit",
ADD COLUMN     "request_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lora_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lora_limit" "LORA_LIMIT" NOT NULL DEFAULT 'ONE';

-- CreateIndex
CREATE UNIQUE INDEX "Lora_request_id_key" ON "Lora"("request_id");
