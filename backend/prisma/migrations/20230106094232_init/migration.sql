-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tribeTypeId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Castle" (
    "id" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Castle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CastleResources" (
    "id" TEXT NOT NULL,
    "gold" INTEGER NOT NULL,
    "castleId" TEXT NOT NULL,
    "goldLastUpdate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CastleResources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TribeType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TribeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tribeTypeId" TEXT NOT NULL,
    "attack" INTEGER NOT NULL,
    "defence" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "carryingCapacity" INTEGER NOT NULL,
    "cropConsumption" INTEGER NOT NULL,
    "creatingSpeed" INTEGER NOT NULL,
    "goldPrice" INTEGER NOT NULL,
    "subsequence" INTEGER NOT NULL,

    CONSTRAINT "UnitType_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "UnitType" ADD CONSTRAINT "UnitType_tribeTypeId_fkey" FOREIGN KEY ("tribeTypeId") REFERENCES "TribeType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Attack" (
    "id" TEXT NOT NULL,
    "castleFromId" TEXT NOT NULL,
    "castleToId" TEXT NOT NULL,

    CONSTRAINT "Attack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitGroup" (
    "id" TEXT NOT NULL,
    "unitTypeId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "ownerCastleId" TEXT,
    "ownerAttackId" TEXT,

    CONSTRAINT "UnitGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CastleResources_castleId_key" ON "CastleResources"("castleId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tribeTypeId_fkey" FOREIGN KEY ("tribeTypeId") REFERENCES "TribeType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Castle" ADD CONSTRAINT "Castle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CastleResources" ADD CONSTRAINT "CastleResources_castleId_fkey" FOREIGN KEY ("castleId") REFERENCES "Castle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attack" ADD CONSTRAINT "Attack_castleFromId_fkey" FOREIGN KEY ("castleFromId") REFERENCES "Castle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attack" ADD CONSTRAINT "Attack_castleToId_fkey" FOREIGN KEY ("castleToId") REFERENCES "Castle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitGroup" ADD CONSTRAINT "UnitGroup_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitGroup" ADD CONSTRAINT "UnitGroup_ownerCastleId_fkey" FOREIGN KEY ("ownerCastleId") REFERENCES "Castle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitGroup" ADD CONSTRAINT "UnitGroup_ownerAttackId_fkey" FOREIGN KEY ("ownerAttackId") REFERENCES "Attack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "TribeType" (id, name) VALUES
    ('591a413b-829e-4e92-a775-bdf620548710', 'Gaul'),
    ('591a413b-829e-4e92-a775-bdf620548711', 'Roman'),
    ('591a413b-829e-4e92-a775-bdf620548712', 'Teuton');

INSERT INTO "UnitType" (id, name, attack, defence, speed, "carryingCapacity", "cropConsumption", "creatingSpeed", "tribeTypeId", "goldPrice", "subsequence") VALUES
    ('11111111-1111-1111-1111-111111111111', 'Legionnaire', 40, 35, 6, 50, 1, 5, '591a413b-829e-4e92-a775-bdf620548711', 50, 1),
    ('11111111-1111-1111-1111-111111111112', 'Praetorian', 30, 65, 5, 20, 1, 7, '591a413b-829e-4e92-a775-bdf620548711', 70, 2),
    ('11111111-1111-1111-1111-111111111113', 'Emperors cavalry', 120, 65, 14, 100, 3, 11, '591a413b-829e-4e92-a775-bdf620548711', 110, 3),
    ('11111111-1111-1111-1111-111111111114', 'Phalanx', 15, 40, 7, 35, 1, 4, '591a413b-829e-4e92-a775-bdf620548710', 40, 1),
    ('11111111-1111-1111-1111-111111111115', 'Swordsman', 65, 35, 6, 45, 1, 5, '591a413b-829e-4e92-a775-bdf620548710', 50, 2),
    ('11111111-1111-1111-1111-111111111116', 'Theutates Thunder', 90, 25, 19, 75, 2, 10, '591a413b-829e-4e92-a775-bdf620548710', 100, 3),
    ('11111111-1111-1111-1111-111111111117', 'Clubswinger', 40, 20, 7, 60, 1, 3, '591a413b-829e-4e92-a775-bdf620548712', 30, 1),
    ('11111111-1111-1111-1111-111111111118', 'Spearfighter', 10, 35, 7, 40, 1, 4, '591a413b-829e-4e92-a775-bdf620548712', 40, 2),
    ('11111111-1111-1111-1111-111111111119', 'Paladin', 55, 100, 10, 110, 2, 10, '591a413b-829e-4e92-a775-bdf620548712', 100, 3);

INSERT INTO "User" (id, name, "tribeTypeId", email, password, role) VALUES
    ('a54e7593-0aa1-4a7c-a8df-6b44cdfab190', 'TestUser', '591a413b-829e-4e92-a775-bdf620548710', 'somemail73@gmail.com', '$2b$10$xGlQRIs008HNsLgDhU840eu.eaIYuCd2OvssTxGUtlbF7TJ.kOS5O', 'ADMIN');

INSERT INTO "Castle" (id, "userId", x, y) VALUES
    ('591a413b-829e-4e92-a775-bdf620548101', 'a54e7593-0aa1-4a7c-a8df-6b44cdfab190', 0, 0);

INSERT INTO "CastleResources" (id, gold, "castleId", "goldLastUpdate") VALUES
    (gen_random_uuid(), 120, '591a413b-829e-4e92-a775-bdf620548101', now());

INSERT INTO "UnitGroup" (id, "unitTypeId", amount, "ownerCastleId", "ownerAttackId") VALUES
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111114', 21, '591a413b-829e-4e92-a775-bdf620548101', null),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111115', 75, '591a413b-829e-4e92-a775-bdf620548101', null),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111116', 12, '591a413b-829e-4e92-a775-bdf620548101', null);
