/*
  Warnings:

  - Added the required column `lora_name` to the `Lora` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lora" ADD COLUMN     "lora_name" TEXT NOT NULL;
