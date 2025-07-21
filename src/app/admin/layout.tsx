"use client";

import React, { useState } from "react";
// import { Layout, Menu, theme } from "antd";
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

// const { Header, Sider, Content } = Layout;

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const pathname = usePathname();
//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

//   const menuItems = [
//     {
//       key: "/admin",
//       icon: <DashboardOutlined />,
//       label: <Link href="/admin">Dashboard</Link>,
//     },
//     {
//       key: "/admin/services",
//       icon: <UserOutlined />,
//       label: <Link href="/admin/services">Services</Link>,
//     },
//     {
//       key: "/admin/games",
//       icon: "0 ",
//       label: <Link href="/admin/games">Games</Link>,
//     },
//     {
//       key: "/admin/reviews",
//       icon: <StarOutlined />,
//       label: <Link href="/admin/reviews">Reviews</Link>,
//     },
//   ];

//   return (
//     <AntdRegistry>
//       <Layout style={{ minHeight: "100vh" }}>
//         <Sider trigger={null} collapsible collapsed={collapsed}>
//           <div className="demo-logo-vertical" />
//           <div
//             style={{
//               height: 32,
//               margin: 16,
//               background: "rgba(255, 255, 255, 0.3)",
//               borderRadius: 6,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "white",
//               fontWeight: "bold",
//             }}
//           >
//             {collapsed ? "DG" : "Diffed.gg Admin"}
//           </div>
//           <Menu
//             theme="dark"
//             mode="inline"
//             selectedKeys={[pathname]}
//             items={menuItems}
//           />
//         </Sider>
//         <Layout>
//           <Header style={{ padding: 0, background: colorBgContainer }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 height: "100%",
//                 paddingLeft: 16,
//               }}
//             >
//               {React.createElement(
//                 collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
//                 {
//                   className: "trigger",
//                   onClick: () => setCollapsed(!collapsed),
//                   style: { fontSize: 18, cursor: "pointer" },
//                 }
//               )}
//             </div>
//           </Header>
//           <Content
//             style={{
//               margin: "24px 16px",
//               padding: 24,
//               minHeight: 280,
//               background: colorBgContainer,
//               borderRadius: borderRadiusLG,
//             }}
//           >
//             {children}
//           </Content>
//         </Layout>
//       </Layout>
//     </AntdRegistry>
//   );
// }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
