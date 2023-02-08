-- CreateTable
CREATE TABLE "UnitOrder" (
    "id" TEXT NOT NULL,
    "castleId" TEXT NOT NULL,
    "unitTypeId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UnitOrder" ADD CONSTRAINT "UnitOrder_castleId_fkey" FOREIGN KEY ("castleId") REFERENCES "Castle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitOrder" ADD CONSTRAINT "UnitOrder_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
