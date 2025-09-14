-- CreateTable
CREATE TABLE "public"."SubscriptionSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "sourceCode" JSONB NOT NULL,
    "language" TEXT NOT NULL,
    "stdin" TEXT,
    "stdout" TEXT,
    "stderr" TEXT,
    "compileOutput" TEXT,
    "status" TEXT NOT NULL,
    "memory" TEXT,
    "time" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubscriptionTestCaseResult" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "testCase" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "stdout" TEXT,
    "expected" TEXT NOT NULL,
    "stderror" TEXT,
    "compileOutput" TEXT,
    "status" TEXT NOT NULL,
    "memory" TEXT,
    "time" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionTestCaseResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubscriptionproblemSolved" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionproblemSolved_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubscriptionPlaylist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlaylist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProblemInSubscriptionPlaylist" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemInSubscriptionPlaylist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubscriptionTestCaseResult_submissionId_idx" ON "public"."SubscriptionTestCaseResult"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionproblemSolved_userId_problemId_key" ON "public"."SubscriptionproblemSolved"("userId", "problemId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlaylist_name_userId_key" ON "public"."SubscriptionPlaylist"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemInSubscriptionPlaylist_playlistId_problemId_key" ON "public"."ProblemInSubscriptionPlaylist"("playlistId", "problemId");

-- AddForeignKey
ALTER TABLE "public"."SubscriptionSubmission" ADD CONSTRAINT "SubscriptionSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubscriptionSubmission" ADD CONSTRAINT "SubscriptionSubmission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."SubscriptionProblem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubscriptionTestCaseResult" ADD CONSTRAINT "SubscriptionTestCaseResult_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."SubscriptionSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubscriptionproblemSolved" ADD CONSTRAINT "SubscriptionproblemSolved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubscriptionproblemSolved" ADD CONSTRAINT "SubscriptionproblemSolved_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."SubscriptionProblem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubscriptionPlaylist" ADD CONSTRAINT "SubscriptionPlaylist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProblemInSubscriptionPlaylist" ADD CONSTRAINT "ProblemInSubscriptionPlaylist_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."SubscriptionPlaylist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProblemInSubscriptionPlaylist" ADD CONSTRAINT "ProblemInSubscriptionPlaylist_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."SubscriptionProblem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
