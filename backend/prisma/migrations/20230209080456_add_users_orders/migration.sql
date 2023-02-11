-- CreateTable
CREATE TABLE "UnitsOrder" (
    "id" TEXT NOT NULL,
    "castleId" TEXT NOT NULL,
    "lastCreationDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitsOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitsOrderItem" (
    "id" TEXT NOT NULL,
    "unitTypeId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "subsequence" INTEGER NOT NULL,

    CONSTRAINT "UnitsOrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UnitsOrder" ADD CONSTRAINT "UnitsOrder_castleId_fkey" FOREIGN KEY ("castleId") REFERENCES "Castle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitsOrderItem" ADD CONSTRAINT "UnitsOrderItem_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitsOrderItem" ADD CONSTRAINT "UnitsOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "UnitsOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
