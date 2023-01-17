-- CreateTable
CREATE TABLE `sighting` (
    `id` VARCHAR(191) NOT NULL,
    `serialNumber` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `positionY` INTEGER NOT NULL,
    `positionX` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pilot` (
    `serialNumber` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
    `lastName` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
    `phoneNumber` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
    `email` VARCHAR(191) NOT NULL DEFAULT 'Unknown',

    PRIMARY KEY (`serialNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sighting` ADD CONSTRAINT `sighting_serialNumber_fkey` FOREIGN KEY (`serialNumber`) REFERENCES `pilot`(`serialNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;
