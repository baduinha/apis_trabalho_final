/*
  Warnings:

  - You are about to drop the `venda_carros` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `usuarioId` to the `carros` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `venda_carros` DROP FOREIGN KEY `venda_carros_carroId_fkey`;

-- DropForeignKey
ALTER TABLE `venda_carros` DROP FOREIGN KEY `venda_carros_compradorId_fkey`;

-- AlterTable
ALTER TABLE `carros` ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `venda_carros`;

-- CreateTable
CREATE TABLE `vendaCarro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `carroId` INTEGER NOT NULL,
    `compradorId` INTEGER NOT NULL,
    `data_venda` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `valor_venda` FLOAT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(40) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `senha` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `acao` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `carros` ADD CONSTRAINT `carros_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendaCarro` ADD CONSTRAINT `vendaCarro_carroId_fkey` FOREIGN KEY (`carroId`) REFERENCES `carros`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendaCarro` ADD CONSTRAINT `vendaCarro_compradorId_fkey` FOREIGN KEY (`compradorId`) REFERENCES `compradores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log` ADD CONSTRAINT `log_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
