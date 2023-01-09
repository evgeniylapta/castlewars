/*
  Warnings:

  - Added the required column `dateTime` to the `Attack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attack" ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL;


INSERT INTO "Attack" (id, "castleFromId", "castleToId", "dateTime") VALUES
    ('591a413b-0001-4e92-a775-bdf620548101', '591a413b-829e-4e92-a775-bdf620548101', '591a413b-829e-4e92-a775-bdf620548102', '2023-01-06 16:58:13.000'),
    ('591a413b-0002-4e92-a775-bdf620548101', '591a413b-829e-4e92-a775-bdf620548103', '591a413b-829e-4e92-a775-bdf620548101', '2023-01-06 16:58:13.000'),
    ('591a413b-0003-4e92-a775-bdf620548101', '591a413b-829e-4e92-a775-bdf620548103', '591a413b-829e-4e92-a775-bdf620548102', '2023-01-06 16:58:13.000');

INSERT INTO "UnitGroup" (id, "unitTypeId", amount, "ownerCastleId", "ownerAttackId") VALUES
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111117', 12, null, '591a413b-0001-4e92-a775-bdf620548101'),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111113', 12, null, '591a413b-0001-4e92-a775-bdf620548101'),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111118', 45, null, '591a413b-0002-4e92-a775-bdf620548101'),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111112', 45, null, '591a413b-0002-4e92-a775-bdf620548101'),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111116', 12, null, '591a413b-0003-4e92-a775-bdf620548101');
