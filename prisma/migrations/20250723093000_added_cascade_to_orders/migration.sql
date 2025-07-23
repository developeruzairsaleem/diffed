-- DropForeignKey
ALTER TABLE "OrderAssignment" DROP CONSTRAINT "OrderAssignment_orderId_fkey";

-- AddForeignKey
ALTER TABLE "OrderAssignment" ADD CONSTRAINT "OrderAssignment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
