"use client";

//  /admin/customers (GET ALL, GET INDIVIDUAL, DELETE)
// application types set here

import {
  OrderSchema,
  OrderUserSchema,
  CustomerArraySchema,
  CustomerSchema,
  WalletSchema,
} from "@/validations/admin/customers.validator";
import type {
  Wallet,
  Order,
  OrderUser,
  Customer,
} from "@/validations/admin/customers.validator";
import React, { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Button,
  message,
  Typography,
  Input,
  Space,
  Tag,
  Badge,
  Row,
  Col,
  Statistic,
  Card,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  UserOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (err) {
      message.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        message.success("Customer deleted");
        fetchCustomers();
      } else {
        message.error("Failed to delete customer");
      }
    } catch {
      message.error("Something went wrong");
    }
  };

  const handleView = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/customers/${id}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to fetch customer details");
      }
      setViewingCustomer(data);
      setModalVisible(true);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const handleSearch = (val: string) => {
    const lower = val.toLowerCase();
    const filtered = customers.filter(
      (c: any) =>
        c.username.toLowerCase().includes(lower) ||
        c.email.toLowerCase().includes(lower)
    );
    setFilteredCustomers(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "orange";
      case "suspended":
        return "red";
      default:
        return "gray";
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      render: (text: string, record: any) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Wallet",
      render: (_: any, record: any) => {
        console.log("record", record);
        return (
          <Space>
            <WalletOutlined />
            <Text>
              ${parseFloat(record.wallet?.balance.value)?.toFixed(2) || "0.00"}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Orders",
      render: (_: any, record: any) => (
        <Badge
          count={record._count?.orderUsers || 0}
          showZero
          style={{ backgroundColor: "#1890ff" }}
        />
      ),
    },
    {
      title: "Joined",
      render: (_: any, record: any) =>
        new Date(record.createdAt).toLocaleDateString(),
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
            type="link"
          >
            View
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            type="link"
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const stats = {
    totalCustomers: filteredCustomers.length,
    totalBalance: filteredCustomers.reduce(
      (acc, c) => acc + (c.wallet?.balance || 0),
      0
    ),
    totalOrders: filteredCustomers.reduce(
      (acc, c) => acc + (c._count?.orderUsers || 0),
      0
    ),
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Customer Management</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Customers"
              value={stats.totalCustomers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Wallets"
              value={stats.totalBalance}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg. Orders"
              value={
                stats.totalCustomers
                  ? (stats.totalOrders / stats.totalCustomers).toFixed(1)
                  : 0
              }
            />
          </Card>
        </Col>
      </Row>

      <Search
        placeholder="Search by name or email"
        onSearch={handleSearch}
        style={{ width: 400, marginBottom: 20 }}
        enterButton={<SearchOutlined />}
        allowClear
      />

      <Table
        columns={columns}
        dataSource={filteredCustomers}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* View Modal */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        title="Customer Details"
        width={800}
      >
        {viewingCustomer ? (
          <>
            <Row gutter={16} style={{ marginBottom: 12 }}>
              <Col span={12}>
                <Text strong>Name:</Text> {viewingCustomer.username}
              </Col>
              <Col span={12}>
                <Text strong>Email:</Text> {viewingCustomer.email}
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 12 }}>
              <Col span={12}>
                <Text strong>Wallet:</Text> $
                {parseFloat(viewingCustomer.wallet?.balance)?.toFixed(2) ||
                  "0.00"}
              </Col>
              <Col span={12}>
                <Text strong>Joined:</Text>{" "}
                {new Date(viewingCustomer.createdAt).toLocaleDateString()}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Title level={4}>Orders</Title>
                {viewingCustomer.orderUsers.length > 0 ? (
                  <Table
                    size="small"
                    dataSource={viewingCustomer.orderUsers}
                    rowKey={(row) => row.Order.id}
                    pagination={false}
                    columns={[
                      {
                        title: "ID",
                        dataIndex: ["Order", "id"],
                      },
                      {
                        title: "Price",
                        dataIndex: ["Order", "price"],
                        render: (price) => `$${price}`,
                      },
                      {
                        title: "Status",
                        dataIndex: ["Order", "status"],
                        render: (status) => (
                          <Tag color={getStatusColor(status)}>{status}</Tag>
                        ),
                      },
                      {
                        title: "Date",
                        dataIndex: ["Order", "createdAt"],
                        render: (date) => new Date(date).toLocaleDateString(),
                      },
                    ]}
                  />
                ) : (
                  <Text type="secondary">No orders available.</Text>
                )}
              </Col>
            </Row>
          </>
        ) : (
          <Text type="secondary">No data available</Text>
        )}
      </Modal>
    </div>
  );
};

export default CustomerPage;
