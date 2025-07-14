import ServicesTable from './table'
import { prisma } from '@/lib/prisma'

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { id: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Services Management</h1>
      </div>
      <ServicesTable services={services} />
    </div>
  );
}
