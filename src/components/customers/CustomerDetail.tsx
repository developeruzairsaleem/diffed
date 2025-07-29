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
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useCustomer } from "@/hooks/useCustomers";
import { Status } from "@/generated/prisma";
import type {
  TransactionDto,
  CustomerUpdateRequest,
} from "@/types/customer.dto";
import type { OrderListDto } from "@/types/order.dto";
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

const transactionTypeColors = {
  deposit: "green",
  withdrawal: "orange",
  payment: "red",
  refund: "blue",
};

interface CustomerDetailProps {
  customerId: string;
}

export default function CustomerDetail({ customerId }: CustomerDetailProps) {
  const { data: customer, loading, error, refetch } = useCustomer(customerId);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!customer) return <div>Customer not found</div>;

  const handleUpdateCustomer = async (values: CustomerUpdateRequest) => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Customer updated successfully");
        setEditModalVisible(false);
        refetch();
      } else {
        message.error(result.error || "Failed to update customer");
      }
    } catch (err) {
      message.error("Network error occurred");
    }
  };

  const orderColumns: ColumnsType<OrderListDto> = [
    {
      title: "Order #",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (orderNumber: string, record: OrderListDto) => (
        <Link href={`/admin/orders/${record.id}`}>
          <Button type="link" size="small">
            #{orderNumber.slice(-8)}
          </Button>
        </Link>
      ),
    },
    {
      title: "Service",
      key: "service",
      render: (_, record: OrderListDto) => (
        <Space>
          <Avatar
            src={record.subpackage.service.game.image}
            size="small"
            shape="square"
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.subpackage.name}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.subpackage.service.game.name}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors = {
          PENDING: "orange",
          IN_PROGRESS: "blue",
          COMPLETED: "green",
          CANCELLED: "red",
        };
        return (
          <Tag color={colors[status as keyof typeof colors]}>
            {status.replace("_", " ")}
          </Tag>
        );
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
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
                  title="Total Orders"
                  value={customer.stats.totalOrders}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Completed Orders"
                  value={customer.stats.completedOrders}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Spent"
                  value={customer.stats.totalSpent}
                  prefix={<DollarOutlined />}
                  precision={2}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Average Order Value"
                  value={customer.stats.averageOrderValue}
                  prefix={<DollarOutlined />}
                  precision={2}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Customer Information">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Username">
                {customer.username}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {customer.email}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[customer.status]}>
                  {statusLabels[customer.status]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                {customer.role}
              </Descriptions.Item>
              <Descriptions.Item label="Stripe Customer ID">
                {customer.stripeCustId || "Not set"}
              </Descriptions.Item>
              <Descriptions.Item label="Wallet Balance">
                {customer.wallet ? (
                  <span style={{ fontWeight: 500 }}>
                    ${customer.wallet.balance.toFixed(2)}{" "}
                    {customer.wallet.currency}
                  </span>
                ) : (
                  "No wallet"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Joined">
                {new Date(customer.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {new Date(customer.updatedAt).toLocaleString()}
              </Descriptions.Item>
              {customer.stats.lastOrderDate && (
                <Descriptions.Item label="Last Order" span={2}>
                  {new Date(customer.stats.lastOrderDate).toLocaleString()}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </div>
      ),
    },
    {
      key: "orders",
      label: `Orders (${customer.orders.length})`,
      children: (
        <Table
          columns={orderColumns}
          dataSource={customer.orders}
          rowKey="id"
        />
      ),
    },
    {
      key: "transactions",
      label: `Transactions (${customer.transactions.length})`,
      children: (
        <Table
          columns={transactionColumns}
          dataSource={customer.transactions}
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
          <Link href="/admin/customers">
            <Button icon={<ArrowLeftOutlined />}>Back to Customers</Button>
          </Link>
          <Avatar
            src={customer.profileImage}
            size="large"
            icon={<UserOutlined />}
          >
            {customer.username[0].toUpperCase()}
          </Avatar>
          <div>
            <h1>{customer.username}</h1>
            <p style={{ margin: 0, color: "#666" }}>{customer.email}</p>
          </div>
        </Space>
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue(customer);
              setEditModalVisible(true);
            }}
          >
            Edit Customer
          </Button>
        </Space>
      </div>

      <Tabs items={tabItems} />

      {/* Edit Customer Modal */}
      <Modal
        title="Edit Customer"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateCustomer}>
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
                Update Customer
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
