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
  Rate,
  Progress,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined,
  DollarOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useProvider } from "@/hooks/useProviders";
import { Status, OrderAssignmentStatus } from "@/generated/prisma";
import type {
  ProviderAssignmentDto,
  ProviderUpdateRequest,
} from "@/types/provider.dto";
import { TransactionDto } from "@/types/customer.dto";
import Link from "next/link";

const { Option } = Select;

const statusColors = {
  [Status.active]: "green",
  [Status.inactive]: "orange",
  [Status.suspended]: "red",
};

const statusLabels = {
  [Status.active]: "Active",
  [Status.inactive]: "Inactive",
  [Status.suspended]: "Suspended",
};

const assignmentStatusColors = {
  [OrderAssignmentStatus.PENDING]: "orange",
  [OrderAssignmentStatus.APPROVED]: "blue",
  [OrderAssignmentStatus.COMPLETED]: "green",
  [OrderAssignmentStatus.VERIFIED]: "purple",
  [OrderAssignmentStatus.REPLACED]: "red",
};

const transactionTypeColors = {
  deposit: "green",
  withdrawal: "orange",
  payment: "red",
  refund: "blue",
};

interface ProviderDetailProps {
  providerId: string;
}

export default function ProviderDetail({ providerId }: ProviderDetailProps) {
  const { data: provider, loading, error, refetch } = useProvider(providerId);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!provider) return <div>Provider not found</div>;

  const handleUpdateProvider = async (values: ProviderUpdateRequest) => {
    try {
      const response = await fetch(`/api/admin/providers/${providerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Provider updated successfully");
        setEditModalVisible(false);
        refetch();
      } else {
        message.error(result.error || "Failed to update provider");
      }
    } catch (err) {
      message.error("Network error occurred");
    }
  };

  const assignmentColumns: ColumnsType<ProviderAssignmentDto> = [
    {
      title: "Order #",
      key: "orderNumber",
      render: (_, record: ProviderAssignmentDto) => (
        <Link href={`/admin/orders/${record.order.id}`}>
          <Button type="link" size="small">
            #{record.order.orderNumber.slice(-8)}
          </Button>
        </Link>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record: ProviderAssignmentDto) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.order.customer.username}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.order.customer.email}
          </div>
        </div>
      ),
    },
    {
      title: "Service",
      key: "service",
      render: (_, record: ProviderAssignmentDto) => (
        <Space>
          <Avatar
            src={record.order.subpackage.service.game.image}
            size="small"
            shape="square"
          />
          <div>
            <div style={{ fontWeight: 500 }}>
              {record.order.subpackage.name}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.order.subpackage.service.game.name}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: ["order", "price"],
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: OrderAssignmentStatus) => (
        <Tag color={assignmentStatusColors[status]}>
          {status.replace("_", " ")}
        </Tag>
      ),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: "Rating",
      dataIndex: "reviewRating",
      key: "reviewRating",
      render: (rating: number | undefined) =>
        rating ? <Rate disabled defaultValue={rating} /> : "-",
    },
    {
      title: "Claimed",
      dataIndex: "claimedAt",
      key: "claimedAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const transactionColumns: ColumnsType<TransactionDto> = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag
          color={
            transactionTypeColors[type as keyof typeof transactionTypeColors]
          }
        >
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record: TransactionDto) => (
        <span
          style={{
            color:
              record.type === "deposit" || record.type === "refund"
                ? "#52c41a"
                : "#f5222d",
          }}
        >
          {record.type === "deposit" || record.type === "refund" ? "+" : "-"}$
          {Math.abs(amount).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string | undefined) => description || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors = {
          pending: "orange",
          completed: "green",
          failed: "red",
          cancelled: "default",
        };
        return (
          <Tag color={colors[status as keyof typeof colors]}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

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
                  title="Total Assignments"
                  value={provider.stats.totalAssignments}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Completed"
                  value={provider.stats.completedAssignments}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Earnings"
                  value={provider.stats.totalEarnings}
                  prefix={<DollarOutlined />}
                  precision={2}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Average Rating"
                  value={provider.stats.averageRating}
                  prefix={<StarOutlined />}
                  precision={1}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Completion Rate"
                  value={provider.stats.completionRate}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: "#52c41a" }}
                />
                <Progress
                  percent={provider.stats.completionRate}
                  showInfo={false}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Approval Rate"
                  value={provider.stats.approvalRate}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: "#1890ff" }}
                />
                <Progress
                  percent={provider.stats.approvalRate}
                  showInfo={false}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Avg Completion Time"
                  value={provider.stats.averageCompletionTime}
                  suffix="days"
                  precision={1}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Provider Information">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Username">
                {provider.username}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {provider.email}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[provider.status]}>
                  {statusLabels[provider.status]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                {provider.role}
              </Descriptions.Item>
              <Descriptions.Item label="Stripe Customer ID">
                {provider.stripeCustId || "Not set"}
              </Descriptions.Item>
              <Descriptions.Item label="Wallet Balance">
                {provider.wallet ? (
                  <span style={{ fontWeight: 500 }}>
                    ${provider.wallet.balance.toFixed(2)}{" "}
                    {provider.wallet.currency}
                  </span>
                ) : (
                  "No wallet"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Joined">
                {new Date(provider.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {new Date(provider.updatedAt).toLocaleString()}
              </Descriptions.Item>
              {provider.stats.lastAssignmentDate && (
                <Descriptions.Item label="Last Assignment" span={2}>
                  {new Date(provider.stats.lastAssignmentDate).toLocaleString()}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {provider.stats.topGames.length > 0 && (
            <Card title="Top Games" style={{ marginTop: 16 }}>
              <Row gutter={16}>
                {provider.stats.topGames.map((game, index) => (
                  <Col span={8} key={game.gameName}>
                    <Card size="small">
                      <Space>
                        <TrophyOutlined
                          style={{ color: index === 0 ? "#faad14" : "#d9d9d9" }}
                        />
                        <div>
                          <div style={{ fontWeight: 500 }}>{game.gameName}</div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {game.assignmentsCount} assignments • $
                            {game.earnings.toFixed(2)}
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
      key: "assignments",
      label: `Assignments (${provider.assignments.length})`,
      children: (
        <Table
          columns={assignmentColumns}
          dataSource={provider.assignments}
          rowKey="id"
        />
      ),
    },
    {
      key: "transactions",
      label: `Transactions (${provider.transactions.length})`,
      children: (
        <Table
          columns={transactionColumns}
          dataSource={provider.transactions}
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
          <Link href="/admin/providers">
            <Button icon={<ArrowLeftOutlined />}>Back to Providers</Button>
          </Link>
          <Avatar
            src={provider.profileImage}
            size="large"
            icon={<UserOutlined />}
          >
            {provider.username[0].toUpperCase()}
          </Avatar>
          <div>
            <h1>{provider.username}</h1>
            <p style={{ margin: 0, color: "#666" }}>{provider.email}</p>
            <Space style={{ marginTop: 4 }}>
              <Rate
                disabled
                defaultValue={provider.stats.averageRating}
                allowHalf
              />
              <span>({provider.stats.averageRating.toFixed(1)})</span>
            </Space>
          </div>
        </Space>
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue(provider);
              setEditModalVisible(true);
            }}
          >
            Edit Provider
          </Button>
        </Space>
      </div>

      <Tabs items={tabItems} />

      {/* Edit Provider Modal */}
      <Modal
        title="Edit Provider"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateProvider}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Select>
              {Object.entries(statusLabels).map(([value, label]) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="profileImage" label="Profile Image URL">
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Provider
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
