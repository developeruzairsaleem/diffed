import type { Metadata } from "next";
import ServiceDetail from "@/components/services/ServiceDetail";

export const metadata: Metadata = {
  title: "Service Details - Admin Dashboard",
  description: "View and manage service details and subpackages",
};

interface ServiceDetailPageProps {
  params: {
    id: string;
  };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  return (
    <div style={{ padding: "24px" }}>
      <ServiceDetail serviceId={params.id} />
    </div>
  );
}
