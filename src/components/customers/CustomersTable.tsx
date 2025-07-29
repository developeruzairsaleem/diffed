"use client";

import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Avatar,
  Tooltip,
  Input,
  Select,
  Card,
  Statistic,
  Row,
  Col,
  InputNumber,
  Form,
  message,
  Modal,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type {
  CustomerListDto,
  CustomersListRequest,
  CustomerUpdateRequest,
} from "@/types/customer.dto";
import { Status } from "@/generated/prisma";
import { useCustomers } from "@/hooks/useCustomers";
import Link from "next/link";

const { Search } = Input;
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

export default function CustomersTable() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState("");
  const [deletingCustomerId, setDeletingCustomerId] = useState("");
  const [form] = Form.useForm();

  const [params, setParams] = useState<CustomersListRequest>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, loading, error, refetch } = useCustomers(params);

  const columns: ColumnsType<CustomerListDto> = [
    {
      title: "Customer",
      key: "customer",
      width: 250,
      render: (_, record: CustomerListDto) => (
        <Space>
          <Avatar
            src={record.profileImage}
            size="default"
            icon={<UserOutlined />}
          >
            {record.username[0].toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.username}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.email}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: Status) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Wallet Balance",
      key: "balance",
      width: 120,
      render: (_, record: CustomerListDto) => (
        <div>
          {record.wallet ? (
            <span style={{ fontWeight: 500 }}>
              ${record.wallet.balance.toFixed(2)} {record.wallet.currency}
            </span>
          ) : (
            <span style={{ color: "#999" }}>No wallet</span>
          )}
        </div>
      ),
    },
    {
      title: "Orders",
      dataIndex: "ordersCount",
      key: "ordersCount",
      width: 80,
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
      title: "Total Spent",
      dataIndex: "totalSpent",
      key: "totalSpent",
      width: 120,
      render: (amount: number) => (
        <span
          style={{ fontWeight: 500, color: amount > 0 ? "#52c41a" : "#999" }}
        >
          ${amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Last Order",
      dataIndex: "lastOrderDate",
      key: "lastOrderDate",
      width: 120,
      render: (date: string | undefined) =>
        date ? (
          new Date(date).toLocaleDateString()
        ) : (
          <span style={{ color: "#999" }}>Never</span>
        ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record: CustomerListDto) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Link href={`/admin/customers/${record.id}`}>
              <Button type="text" icon={<EyeOutlined />} size="small" />
            </Link>
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              onClick={() => {
                form.setFieldsValue(record);
                setEditModalVisible(true);
                setEditingCustomerId(record.id);
              }}
              type="text"
              icon={<EditOutlined />}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              loading={deletingCustomerId === record.id}
              onClick={() => handleDeleteCustomer({ customerId: record.id })}
              icon={<DeleteOutlined />}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // handleDeleteCustomer
  // deleting an order
  const handleDeleteCustomer = async ({
    customerId,
  }: {
    customerId: string;
  }) => {
    Modal.confirm({
      title: "Are you sure you want to delete this customer?",
      okText: "Yes, delete",
      cancelText: "Cancel",
      onOk: async () => {
        setDeletingCustomerId(customerId);
        try {
          const res = await fetch(`/api/admin/customers/${customerId}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Failed to delete");
          else {
            await refetch();
            message.success("Customer deleted");
          }
          // refetch data if needed
        } catch (err) {
          message.error("Error deleting customer");
        } finally {
          setDeletingCustomerId("");
        }
      },
    });
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setParams((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: sorter.field || "createdAt",
      sortOrder: sorter.order === "ascend" ? "asc" : "desc",
    }));
  };

  const handleSearch = (value: string) => {
    setParams((prev) => ({
      ...prev,
      search: value || undefined,
      page: 1,
    }));
  };

  const handleStatusFilter = (status: Status | undefined) => {
    setParams((prev) => ({
      ...prev,
      status,
      page: 1,
    }));
  };

  const handleOrdersFilter = (hasOrders: boolean | undefined) => {
    setParams((prev) => ({
      ...prev,
      hasOrders,
      page: 1,
    }));
  };

  const handleSpentFilter = (
    min: number | undefined,
    max: number | undefined
  ) => {
    setParams((prev) => ({
      ...prev,
      minSpent: min,
      maxSpent: max,
      page: 1,
    }));
  };

  const handleUpdateCustomer = async (values: CustomerUpdateRequest) => {
    try {
      const response = await fetch(
        `/api/admin/customers/${editingCustomerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const result = await response.json();

      if (result.success) {
        message.success("Customer updated successfully");
        setEditModalVisible(false);
        setEditingCustomerId("");
        refetch();
      } else {
        message.error(result.error || "Failed to update customer");
      }
    } catch (err) {
      message.error("Network error occurred");
    }
  };

  return (
    <div>
      {/* Statistics Cards */}
      {data?.stats && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Customers"
                value={data.stats.totalCustomers}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active Customers"
                value={data.stats.activeCustomers}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={data.stats.totalRevenue}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Avg Customer Value"
                value={data.stats.averageCustomerValue}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search customers..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: 150 }}
              onChange={handleStatusFilter}
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Has orders"
              allowClear
              style={{ width: 150 }}
              onChange={handleOrdersFilter}
            >
              <Option value={true}>Has Orders</Option>
              <Option value={false}>No Orders</Option>
            </Select>
            <Space.Compact>
              <InputNumber
                placeholder="Min spent"
                min={0}
                style={{ width: 120 }}
                onChange={(value) =>
                  handleSpentFilter(value || undefined, params.maxSpent)
                }
              />
              <InputNumber
                placeholder="Max spent"
                min={0}
                style={{ width: 120 }}
                onChange={(value) =>
                  handleSpentFilter(params.minSpent, value || undefined)
                }
              />
            </Space.Compact>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={data?.customers || []}
          rowKey="id"
          loading={loading}
          pagination={{
            current: data?.page || 1,
            pageSize: data?.limit || 10,
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} customers`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>
      {/* Edit Customer Modal */}
      <Modal
        title="Edit Customer"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingCustomerId("");
        }}
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
              <Button
                onClick={() => {
                  setEditModalVisible(false);
                  setEditingCustomerId("");
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
