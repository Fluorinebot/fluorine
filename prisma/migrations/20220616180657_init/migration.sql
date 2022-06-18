-- CreateTable
CREATE TABLE "cases" (
    "case_id" INTEGER NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "case_creator" BIGINT NOT NULL,
    "moderated_user" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("case_id","guild_id")
);

-- CreateTable
CREATE TABLE "config" (
    "guild_id" BIGINT NOT NULL,
    "prefix" TEXT NOT NULL,
    "logs_enabled" BOOLEAN NOT NULL,
    "logs_channel" BIGINT,
    "log_moderation_actions" BOOLEAN,
    "antibot_factor" INTEGER NOT NULL,
    "antibot_action" TEXT,
    "currency" TEXT,

    CONSTRAINT "config_pkey" PRIMARY KEY ("guild_id")
);

-- CreateTable
CREATE TABLE "cooldowns" (
    "user_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,

    CONSTRAINT "cooldowns_pkey" PRIMARY KEY ("user_id","name")
);

-- CreateTable
CREATE TABLE "economy" (
    "guild_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "wallet_bal" INTEGER NOT NULL,
    "bank_bal" INTEGER NOT NULL,

    CONSTRAINT "economy_pkey" PRIMARY KEY ("guild_id","user_id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "user_id" BIGINT NOT NULL,
    "description" TEXT,
    "pronouns" TEXT,
    "website" TEXT,
    "location" TEXT,
    "birthday" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "shop_items" (
    "item_id" INTEGER NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "role" BIGINT,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "shop_items_pkey" PRIMARY KEY ("item_id","guild_id")
);

-- CreateIndex
CREATE INDEX "cases_moderated_user_idx" ON "cases"("moderated_user");
