-- CreateTable
CREATE TABLE `carros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modelo` VARCHAR(40) NOT NULL,
    `marca` VARCHAR(30) NOT NULL,
    `ano` INTEGER NOT NULL,
    `combustivel` ENUM('FLEX', 'GASOLINA', 'ALCOOL', 'DIESEL', 'ELETRICO') NOT NULL DEFAULT 'FLEX',
    `preco` FLOAT NOT NULL,
    `vendido` BOOLEAN NOT NULL DEFAULT false,
    `estoque` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compradores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(40) NOT NULL,
    `cnh` VARCHAR(14) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `endereco` VARCHAR(100) NOT NULL,
    `telefone` VARCHAR(15) NOT NULL,

    UNIQUE INDEX `compradores_cnh_key`(`cnh`),
    UNIQUE INDEX `compradores_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venda_carros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `carroId` INTEGER NOT NULL,
    `compradorId` INTEGER NOT NULL,
    `data_venda` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `valor_venda` FLOAT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `venda_carros` ADD CONSTRAINT `venda_carros_carroId_fkey` FOREIGN KEY (`carroId`) REFERENCES `carros`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venda_carros` ADD CONSTRAINT `venda_carros_compradorId_fkey` FOREIGN KEY (`compradorId`) REFERENCES `compradores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
