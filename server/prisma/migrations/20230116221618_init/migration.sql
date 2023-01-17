/*
  Warnings:

  - You are about to drop the `pilot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sighting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `sighting` DROP FOREIGN KEY `sighting_serialNumber_fkey`;

-- DropTable
DROP TABLE `pilot`;

-- DropTable
DROP TABLE `sighting`;

-- CreateTable
CREATE TABLE `Pilot` (
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
