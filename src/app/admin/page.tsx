// import { Card, Col, Row, Statistic } from "antd";
// import { UserOutlined, StarOutlined } from "@ant-design/icons";
// import { prisma } from "@/lib/prisma";

// async function getDashboardStats() {
//   const [servicesCount, gamesCount, reviewsCount] = await Promise.all([
//     prisma.service.count(),
//     prisma.game.count(),
//     prisma.review.count(),
//   ]);

//   return {
//     servicesCount,
//     gamesCount,
//     reviewsCount,
//   };
// }

// export default async function AdminDashboard() {
//   const stats = await getDashboardStats();

//   return (
//     <div>
//       <h1 style={{ marginBottom: 24 }}>Dashboard</h1>
//       <Row gutter={16}>
//         <Col span={8}>
//           <Card>
//             <Statistic
//               title="Total Services"
//               value={stats.servicesCount}
//               prefix={<UserOutlined />}
//               valueStyle={{ color: "#3f8600" }}
//             />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic
//               title="Total Games"
//               value={stats.gamesCount}
//               prefix={"0 "}
//               valueStyle={{ color: "#1890ff" }}
//             />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic
//               title="Total Reviews"
//               value={stats.reviewsCount}
//               prefix={<StarOutlined />}
//               valueStyle={{ color: "#cf1322" }}
//             />
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }

"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GamesTab } from "@/components/admin/games-tab";
import { ServicesTab } from "@/components/admin/services-tab";
import { SubpackagesTab } from "@/components/admin/subpackages-tab";
import { ProvidersTab } from "@/components/admin/providers-tab";
import { OrdersTab } from "@/components/admin/orders-tab";
import { CustomersTab } from "@/components/admin/customers-tab";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="games" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="subpackages">Subpackages</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="games">
          <GamesTab />
        </TabsContent>

        <TabsContent value="services">
          <ServicesTab />
        </TabsContent>

        <TabsContent value="subpackages">
          <SubpackagesTab />
        </TabsContent>

        <TabsContent value="providers">
          <ProvidersTab />
        </TabsContent>

        <TabsContent value="customers">
          <CustomersTab />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
