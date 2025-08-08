import { Card, Col, Row, Statistic } from "antd";
import { UserOutlined, StarOutlined } from "@ant-design/icons";
import { prisma } from "@/lib/prisma";

async function getDashboardStats() {
  const [servicesCount, gamesCount, customerCount, providerCount] =
    await Promise.all([
      prisma.service.count(),
      prisma.game.count(),
      prisma.user.count({
        where: { role: "customer" },
      }),
      prisma.user.count({
        where: { role: "provider" },
      }),
    ]);

  return {
    servicesCount,
    gamesCount,
    customerCount,
    providerCount,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Services"
              value={stats.servicesCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Games"
              value={stats.gamesCount}
              prefix={"0 "}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Customers"
              value={stats.customerCount}
              prefix={<StarOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Providers"
              value={stats.providerCount}
              prefix={<StarOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
