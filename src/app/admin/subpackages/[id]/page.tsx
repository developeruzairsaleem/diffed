import type { Metadata } from "next";
import SubpackageDetail from "@/components/subpackages/SubpackageDetail";

export const metadata: Metadata = {
  title: "Subpackage Details - Admin Dashboard",
  description: "View and manage subpackage details, pricing, and orders",
};

interface SubpackageDetailPageProps {
  params: {
    id: string;
  };
}

export default function SubpackageDetailPage({
  params,
}: SubpackageDetailPageProps) {
  return (
    <div style={{ padding: "24px" }}>
      <SubpackageDetail subpackageId={params.id} />
    </div>
  );
}
