-- CreateTable
CREATE TABLE "DemandRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "squadIntent" TEXT NOT NULL,
    "businessDomain" TEXT NOT NULL,
    "projectCode" TEXT NOT NULL,
    "requiredRole" TEXT NOT NULL,
    "requiredSkills" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "durationWeeks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EmployeeProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "primaryRole" TEXT NOT NULL,
    "currentAllocationPercentage" INTEGER NOT NULL DEFAULT 0,
    "availabilityDate" DATETIME NOT NULL,
    "geographicLocation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SkillProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "proficiencyLevel" INTEGER NOT NULL,
    CONSTRAINT "SkillProfile_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScoringResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "demandId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "sTotal" REAL NOT NULL,
    "sSkill" REAL NOT NULL,
    "sAvail" REAL NOT NULL,
    "sRole" REAL NOT NULL,
    "rank" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScoringResult_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "DemandRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ScoringResult_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProposedSquad" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "squadName" TEXT NOT NULL,
    "demandId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProposedSquad_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "DemandRequest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SquadMembership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "squadId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "assignedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SquadMembership_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "ProposedSquad" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SquadMembership_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeProfile_email_key" ON "EmployeeProfile"("email");

-- CreateIndex
CREATE INDEX "SkillProfile_skill_idx" ON "SkillProfile"("skill");

-- CreateIndex
CREATE UNIQUE INDEX "SkillProfile_employeeId_skill_key" ON "SkillProfile"("employeeId", "skill");

-- CreateIndex
CREATE INDEX "ScoringResult_demandId_rank_idx" ON "ScoringResult"("demandId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "ScoringResult_demandId_employeeId_key" ON "ScoringResult"("demandId", "employeeId");

-- CreateIndex
CREATE INDEX "SquadMembership_employeeId_idx" ON "SquadMembership"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "SquadMembership_squadId_employeeId_key" ON "SquadMembership"("squadId", "employeeId");
