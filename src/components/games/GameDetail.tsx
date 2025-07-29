"use client";

import { useState } from "react";
import {
  Card,
  Descriptions,
  Tag,
  Avatar,
  Space,
  Button,
  Tabs,
  Table,
  Form,
  Input,
  Select,
  message,
  Modal,
  Row,
  Col,
  Statistic,
  Progress,
  Switch,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { LuGamepad2 } from "react-icons/lu";
import type { ColumnsType } from "antd/es/table";
import { useGame } from "@/hooks/useGames";
import type {
  GameUpdateRequest,
  ServiceCreateRequest,
  SubpackageCreateRequest,
} from "@/types/game.dto";
import Link from "next/link";

const { TextArea } = Input;
const { Option } = Select;

interface GameDetailProps {
  gameId: string;
}

export default function GameDetail({ gameId }: GameDetailProps) {
  const { data: game, loading, error, refetch } = useGame(gameId);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [subpackageModalVisible, setSubpackageModalVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [form] = Form.useForm();
  const [serviceForm] = Form.useForm();
  const [subpackageForm] = Form.useForm();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!game) return <div>Game not found</div>;

  const handleUpdateGame = async (values: GameUpdateRequest) => {
    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Game updated successfully");
        setEditModalVisible(false);
        refetch();
      } else {
        message.error(result.error || "Failed to update game");
      }
    } catch (err) {
      message.error("Network error occurred");
    }
  };

  const handleCreateService = async (values: ServiceCreateRequest) => {
    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, gameId }),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Service created successfully");
        setServiceModalVisible(false);
        serviceForm.resetFields();
        refetch();
      } else {
        message.error(result.error || "Failed to create service");
      }
    } catch (err) {
      message.error("Network error occurred");
    }
  };

  const handleCreateSubpackage = async (values: SubpackageCreateRequest) => {
    try {
      const response = await fetch("/api/admin/subpackages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, serviceId: selectedServiceId }),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Subpackage created successfully");
        setSubpackageModalVisible(false);
        subpackageForm.resetFields();
        setSelectedServiceId("");
        refetch();
      } else {
        message.error(result.error || "Failed to create subpackage");
      }
    } catch (err) {
      message.error("Network error occurred");
    }
  };

  const serviceColumns: ColumnsType<any> = [
    {
      title: "Service Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: any) => (
        <Link href={`/admin/services/${record.id}`}>
          <Button type="link" style={{ padding: 0, fontWeight: 500 }}>
            {name}
          </Button>
        </Link>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => (
        <span style={{ color: "#666" }}>
          {description.length > 50
            ? `${description.slice(0, 50)}...`
            : description}
        </span>
      ),
    },
    {
      title: "Subpackages",
      dataIndex: "subpackagesCount",
      key: "subpackagesCount",
      render: (count: number) => (
        <span
          style={{
            fontWeight: count > 0 ? 500 : 400,
            color: count > 0 ? "#1890ff" : "#999",
          }}
        >
          {count}
        </span>
      ),
    },
    {
      title: "Orders",
      dataIndex: "ordersCount",
      key: "ordersCount",
      render: (count: number) => (
        <span
          style={{
            fontWeight: count > 0 ? 500 : 400,
            color: count > 0 ? "#722ed1" : "#999",
          }}
        >
          {count}
        </span>
      ),
    },
    {
      title: "Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (amount: number) => (
        <span
          style={{ fontWeight: 500, color: amount > 0 ? "#52c41a" : "#999" }}
        >
          ${amount.toFixed(2)}
        </span>
      ),
    },
  ];

  const subpackageColumns: ColumnsType<any> = [
    {
      title: "Package Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span style={{ fontWeight: 500, color: "#52c41a" }}>
          ${price.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration: string | undefined) => duration || "-",
    },
    {
      title: "Dynamic Pricing",
      dataIndex: "dynamicPricing",
      key: "dynamicPricing",
      render: (dynamic: boolean) => (
        <Tag color={dynamic ? "blue" : "default"}>
          {dynamic ? "Dynamic" : "Fixed"}
        </Tag>
      ),
    },
    {
      title: "Orders",
      dataIndex: "ordersCount",
      key: "ordersCount",
      render: (count: number) => (
        <span
          style={{
            fontWeight: count > 0 ? 500 : 400,
            color: count > 0 ? "#722ed1" : "#999",
          }}
        >
          {count}
        </span>
      ),
    },
    {
      title: "Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (amount: number) => (
        <span
          style={{ fontWeight: 500, color: amount > 0 ? "#52c41a" : "#999" }}
        >
          ${amount.toFixed(2)}
        </span>
      ),
    },
  ];

  const allSubpackages = game.services.flatMap((service) =>
    service.subpackages.map((sub) => ({ ...sub, serviceName: service.name }))
  );

  const tabItems = [
    {
      key: "overview",
      label: "Overview",
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Services"
                  value={game.stats.totalServices}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Orders"
                  value={game.stats.totalOrders}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={game.stats.totalRevenue}
                  prefix={<DollarOutlined />}
                  precision={2}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Completion Rate"
                  value={game.stats.completionRate}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: "#52c41a" }}
                />
                <Progress
                  percent={game.stats.completionRate}
                  showInfo={false}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Game Information">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Game Name">
                {game.name}
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color={game.isEloBased ? "blue" : "default"}>
                  {game.isEloBased ? "ELO-based" : "Standard"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Subpackages">
                {game.stats.totalSubpackages}
              </Descriptions.Item>
              <Descriptions.Item label="Average Order Value">
                ${game.stats.averageOrderValue.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Completed Orders">
                {game.stats.completedOrders}
              </Descriptions.Item>
              <Descriptions.Item label="Pending Orders">
                {game.stats.pendingOrders}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {new Date(game.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {new Date(game.updatedAt).toLocaleString()}
              </Descriptions.Item>
              {Array.isArray(game?.ranks) && game.ranks.length > 0 && (
                <Descriptions.Item label="Ranks" span={2}>
                  <Space wrap>
                    {game?.ranks?.map((rank: any, index: any) => (
                      <Tag key={index} color="blue">
                        {rank}
                      </Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {game.stats.topServices.length > 0 && (
            <Card title="Top Services" style={{ marginTop: 16 }}>
              <Row gutter={16}>
                {game.stats.topServices.map((service, index) => (
                  <Col span={8} key={service.serviceName}>
                    <Card size="small">
                      <Space>
                        <TrophyOutlined
                          style={{ color: index === 0 ? "#faad14" : "#d9d9d9" }}
                        />
                        <div>
                          <div style={{ fontWeight: 500 }}>
                            {service.serviceName}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {service.ordersCount} orders • $
                            {service.revenue.toFixed(2)}
                          </div>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </div>
      ),
    },
    {
      key: "services",
      label: `Services (${game.services.length})`,
      children: (
        <div>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "flex-end",
            }}
          ></div>
          <Table
            columns={serviceColumns}
            dataSource={game.services}
            rowKey="id"
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: "subpackages",
      label: `All Subpackages (${game.stats.totalSubpackages})`,
      children: (
        <Table
          columns={subpackageColumns}
          dataSource={allSubpackages}
          rowKey="id"
        />
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space>
          <Link href="/admin/games">
            <Button icon={<ArrowLeftOutlined />}>Back to Games</Button>
          </Link>
          <Avatar
            src={game.image}
            size="large"
            shape="square"
            icon={<LuGamepad2 />}
          >
            {game.name[0].toUpperCase()}
          </Avatar>
          <div>
            <h1>{game.name}</h1>
            <p style={{ margin: 0, color: "#666" }}>
              {game.isEloBased ? "ELO-based Game" : "Standard Game"} •{" "}
              {game.services.length} services
            </p>
          </div>
        </Space>
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue({
                ...game,
                ranks: JSON.stringify(game?.ranks || [], null, 2),
              });
              setEditModalVisible(true);
            }}
          >
            Edit Game
          </Button>
        </Space>
      </div>

      <Tabs items={tabItems} />

      {/* Edit Game Modal */}
      <Modal
        title="Edit Game"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateGame}>
          <Form.Item
            name="name"
            label="Game Name"
            rules={[{ required: true, message: "Game name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Game Image URL"
            rules={[{ required: true, message: "Image URL is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isEloBased"
            label="ELO-based Game"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item name="ranks" label="Ranks (JSON Array)">
            <TextArea
              rows={4}
              onChange={(e) => {
                try {
                  const ranks = JSON.parse(e.target.value || "[]");
                  form.setFieldValue("ranks", ranks);
                } catch {
                  // Invalid JSON, ignore
                }
              }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Game
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Service Modal */}
      <Modal
        title="Create New Service"
        open={serviceModalVisible}
        onCancel={() => setServiceModalVisible(false)}
        footer={null}
      >
        <Form
          form={serviceForm}
          layout="vertical"
          onFinish={handleCreateService}
        >
          <Form.Item
            name="name"
            label="Service Name"
            rules={[{ required: true, message: "Service name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Service
              </Button>
              <Button onClick={() => setServiceModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Subpackage Modal */}
      <Modal
        title="Create New Subpackage"
        open={subpackageModalVisible}
        onCancel={() => setSubpackageModalVisible(false)}
        footer={null}
      >
        <Form
          form={subpackageForm}
          layout="vertical"
          onFinish={handleCreateSubpackage}
        >
          <Form.Item
            name="name"
            label="Package Name"
            rules={[{ required: true, message: "Package name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Price is required" }]}
          >
            <Input type="number" min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            name="requiredProviders"
            label="No of Pros Needed"
            rules={[{ required: true, message: "No of gamers is required" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item name="duration" label="Duration">
            <Input placeholder="e.g., 2-3 days" />
          </Form.Item>
          <Form.Item
            name="dynamicPricing"
            label="Dynamic Pricing"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item name="basePricePerELO" label="Base Price per ELO">
            <Input type="number" min={0} step={0.01} />
          </Form.Item>
          <Form.Item name="minELO" label="Minimum ELO">
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item name="maxELO" label="Maximum ELO">
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Subpackage
              </Button>
              <Button onClick={() => setSubpackageModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
