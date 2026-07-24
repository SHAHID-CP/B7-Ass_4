-- AlterEnum
ALTER TYPE "RentalStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "profileImage" TEXT;
