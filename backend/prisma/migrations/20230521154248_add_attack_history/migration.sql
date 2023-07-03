-- CreateTable
CREATE TABLE "AttackHistory" (
    "id" TEXT NOT NULL,
    "castleFromId" TEXT NOT NULL,
    "castleToId" TEXT NOT NULL,
    "attackDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttackHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttackHistoryItem" (
    "id" TEXT NOT NULL,
    "attackHistoryId" TEXT NOT NULL,
    "isDefence" BOOLEAN NOT NULL,
    "unitTypeId" TEXT NOT NULL,
    "oldAmount" INTEGER NOT NULL,
    "newAmount" INTEGER NOT NULL,

    CONSTRAINT "AttackHistoryItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AttackHistory" ADD CONSTRAINT "AttackHistory_castleFromId_fkey" FOREIGN KEY ("castleFromId") REFERENCES "Castle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttackHistory" ADD CONSTRAINT "AttackHistory_castleToId_fkey" FOREIGN KEY ("castleToId") REFERENCES "Castle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttackHistoryItem" ADD CONSTRAINT "AttackHistoryItem_attackHistoryId_fkey" FOREIGN KEY ("attackHistoryId") REFERENCES "AttackHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttackHistoryItem" ADD CONSTRAINT "AttackHistoryItem_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
