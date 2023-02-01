-- CreateTable
CREATE TABLE "MapSettlement" (
    "id" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "settleAngleIndex" INTEGER NOT NULL,

    CONSTRAINT "MapSettlement_pkey" PRIMARY KEY ("id")
);

INSERT INTO "MapSettlement" (id, direction, "settleAngleIndex") VALUES
    (gen_random_uuid(), 'leftBottom', 0),
    (gen_random_uuid(), 'leftTop', 0),
    (gen_random_uuid(), 'rightBottom', 0),
    (gen_random_uuid(), 'rightTop', 0);
