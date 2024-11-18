/*
  Warnings:

  - A unique constraint covering the columns `[lora_path]` on the table `Lora` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Lora_lora_path_key" ON "Lora"("lora_path");
