-- CreateTable
CREATE TABLE "BotAction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotAction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BotAction" ADD CONSTRAINT "BotAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "BotAction_userId_key" ON "BotAction"("userId");
