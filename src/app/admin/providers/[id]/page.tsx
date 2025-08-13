import type { Metadata } from "next";
import ProviderDetail from "@/components/providers/ProviderDetail";

export const metadata: Metadata = {
  title: "Provider Details - Admin Dashboard",
  description: "View and manage provider details",
};

// interface ProviderDetailPageProps {
//   params: {
//     id: string;
//   };
// }

export default function ProviderDetailPage({ params }: any) {
  return (
    <div style={{ padding: "24px" }}>
      <ProviderDetail providerId={params.id} />
    </div>
  );
}
