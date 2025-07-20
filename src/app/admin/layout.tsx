"use client";

import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import {
  DashboardOutlined,
  UserOutlined,
  StarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/services",
      icon: <UserOutlined />,
      label: <Link href="/admin/services">Services</Link>,
    },
    {
      key: "/admin/games",
      icon: "0 ",
      label: <Link href="/admin/games">Games</Link>,
    },
    {
      key: "/admin/reviews",
      icon: <StarOutlined />,
      label: <Link href="/admin/reviews">Reviews</Link>,
    },
  ];

  return (
    <AntdRegistry>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <div
            style={{
              height: 32,
              margin: 16,
              background: "rgba(255, 255, 255, 0.3)",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {collapsed ? "DG" : "Diffed.gg Admin"}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                paddingLeft: 16,
              }}
            >
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: () => setCollapsed(!collapsed),
                  style: { fontSize: 18, cursor: "pointer" },
                }
              )}
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </AntdRegistry>
  );
}

// "use client"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { GamesTab } from "@/components/admin/games-tab"
// import { ServicesTab } from "@/components/admin/services-tab"
// import { SubpackagesTab } from "@/components/admin/subpackages-tab"
// import { ProvidersTab } from "@/components/admin/providers-tab"
// import { OrdersTab } from "@/components/admin/orders-tab"
// import { CustomersTab } from "@/components/admin/customers-tab"

// export default function AdminDashboard() {
//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

//       <Tabs defaultValue="games" className="w-full">
//         <TabsList className="grid w-full grid-cols-6">
//           <TabsTrigger value="games">Games</TabsTrigger>
//           <TabsTrigger value="services">Services</TabsTrigger>
//           <TabsTrigger value="subpackages">Subpackages</TabsTrigger>
//           <TabsTrigger value="providers">Providers</TabsTrigger>
//           <TabsTrigger value="customers">Customers</TabsTrigger>
//           <TabsTrigger value="orders">Orders</TabsTrigger>
//         </TabsList>

//         <TabsContent value="games">
//           <GamesTab />
//         </TabsContent>

//         <TabsContent value="services">
//           <ServicesTab />
//         </TabsContent>

//         <TabsContent value="subpackages">
//           <SubpackagesTab />
//         </TabsContent>

//         <TabsContent value="providers">
//           <ProvidersTab />
//         </TabsContent>

//         <TabsContent value="customers">
//           <CustomersTab />
//         </TabsContent>

//         <TabsContent value="orders">
//           <OrdersTab />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }
