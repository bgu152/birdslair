/*
  Warnings:

  - You are about to drop the `Pilot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Pilot`;

-- CreateTable
CREATE TABLE `pilot` (
    `serialNumber` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
    `lastName` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
    `phoneNumber` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
    `email` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
    `lastSeen` DATETIME(3) NOT NULL,
    `lastViolation` DATETIME(3) NOT NULL,
    `closestDistance` DOUBLE NOT NULL,

    PRIMARY KEY (`serialNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
