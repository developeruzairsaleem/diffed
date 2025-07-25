"use client";

import { useState } from "react";
import {
  Table,
  Button,
  Space,
  Avatar,
  Tooltip,
  Input,
  Select,
  Card,
  Modal,
  Form,
  message,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { LuGamepad2 } from "react-icons/lu";
import type { ColumnsType } from "antd/es/table";
import { useServices } from "@/hooks/useGames";
import type {
  ServicesListRequest,
  ServiceCreateRequest,
} from "@/types/game.dto";
import Link from "next/link";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

export default function ServicesTable() {
  const [params, setParams] = useState<ServicesListRequest>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { data, loading, error, refetch } = useServices(params);

  const handleCreateService = async (values: ServiceCreateRequest) => {
    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Service created successfully");
        setCreateModalVisible(false);
        form.resetFields();
        refetch();
      } else {
        message.error(result.error || "Failed to create service");
      }
    } catch (err) {
      message.error("Network error occurred");
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        message.success("Service deleted successfully");
        refetch();
      } else {
        message.error(result.error || "Failed to delete service");
      }
    } catch (err) {
      message.error("Network error occurred");
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Service",
      key: "service",
      width: 300,
      render: (_, record: any) => (
        <Space>
          <Avatar
            src={record.game.image}
            size="default"
            shape="square"
            icon={<LuGamepad2 />}
          >
            {record.game.name[0].toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.description.length > 50
                ? `${record.description.slice(0, 50)}...`
                : record.description}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Game",
      key: "game",
      width: 150,
      render: (_, record: any) => (
        <Link href={`/admin/games/${record.gameId}`}>
          <Button type="link" size="small">
            {record.game.name}
          </Button>
        </Link>
      ),
    },
    {
      title: "Subpackages",
      dataIndex: "subpackagesCount",
      key: "subpackagesCount",
      width: 120,
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
      width: 100,
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
      title: "Total Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
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
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record: any) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Link href={`/admin/services/${record.id}`}>
              <Button type="text" icon={<EyeOutlined />} size="small" />
            </Link>
          </Tooltip>
      
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: "Delete Service",
                  content: `Are you sure you want to delete "${record.name}"?`,
                  onOk: () => handleDeleteService(record.id),
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

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

  const handleGameFilter = (gameId: string | undefined) => {
    setParams((prev) => ({
      ...prev,
      gameId,
      page: 1,
    }));
  };

  return (
    <div>
      <Card>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space wrap>
            <Search
              placeholder="Search services..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Select
              placeholder="Filter by game"
              allowClear
              style={{ width: 200 }}
              onChange={handleGameFilter}
            >
              {data?.games.map((game) => {
                return (
                  <Option value={game?.id} key={game?.id}>
                    {game?.name}
                  </Option>
                );
              })}
            </Select>
            <Button icon={<FilterOutlined />}>More Filters</Button>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Add Service
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={data?.services || []}
          rowKey="id"
          loading={loading}
          pagination={{
            current: data?.page || 1,
            pageSize: data?.limit || 10,
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} services`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create Service Modal */}
      <Modal
        title="Create New Service"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateService}>
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
          <Form.Item
            name="gameId"
            label="Game"
            rules={[{ required: true, message: "Game selection is required" }]}
          >
            <Select placeholder="Select a game">
              {data?.games.map((game) => {
                return (
                  <Option key={game.id} value={game.id}>
                    {game.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Service
              </Button>
              <Button onClick={() => setCreateModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
