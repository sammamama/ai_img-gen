/*
  Warnings:

  - Added the required column `config_file_content_type` to the `Lora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `config_file_url` to the `Lora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lora_file_content_type` to the `Lora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lora_path` to the `Lora` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lora" ADD COLUMN     "config_file_content_type" TEXT NOT NULL,
ADD COLUMN     "config_file_url" TEXT NOT NULL,
ADD COLUMN     "lora_file_content_type" TEXT NOT NULL,
ADD COLUMN     "lora_path" TEXT NOT NULL;
