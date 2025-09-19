-- CreateTable
CREATE TABLE "public"."SubscriptionPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPurchase_userId_playlistId_key" ON "public"."SubscriptionPurchase"("userId", "playlistId");

-- AddForeignKey
ALTER TABLE "public"."SubscriptionPurchase" ADD CONSTRAINT "SubscriptionPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubscriptionPurchase" ADD CONSTRAINT "SubscriptionPurchase_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."SubscriptionPlaylist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
