-- DropForeignKey
ALTER TABLE "UnitGroup" DROP CONSTRAINT "UnitGroup_ownerAttackId_fkey";

-- DropForeignKey
ALTER TABLE "UnitGroup" DROP CONSTRAINT "UnitGroup_ownerCastleId_fkey";

-- AddForeignKey
ALTER TABLE "UnitGroup" ADD CONSTRAINT "UnitGroup_ownerCastleId_fkey" FOREIGN KEY ("ownerCastleId") REFERENCES "Castle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitGroup" ADD CONSTRAINT "UnitGroup_ownerAttackId_fkey" FOREIGN KEY ("ownerAttackId") REFERENCES "Attack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
