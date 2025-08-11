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
  Modal,
  Form,
  Switch,
  message,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  PlusOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { LuGamepad2 } from "react-icons/lu";

import type { ColumnsType } from "antd/es/table";
import type {
  GameListDto,
  GamesListRequest,
  GameCreateRequest,
} from "@/types/game.dto";
import { useGames } from "@/hooks/useGames";
import Link from "next/link";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

export default function GamesTable() {
  const [params, setParams] = useState<GamesListRequest>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { data, loading, error, refetch } = useGames(params);

  const handleCreateGame = async (values: GameCreateRequest) => {
    try {
      setCreateLoading(true);
      const response = await fetch("/api/admin/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          ranks: null, // added null constraints for all the games
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCreateModalVisible(false);
        form.resetFields();
        refetch();
      }
    } catch (err) {
      console.error("Error creating game:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  // hnadle delete game
  const handleDeleteGame = async (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete the current game.",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: async function () {
        try {
          const res = await fetch(`/api/admin/games/${id}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Failed to delete Game");
          else {
            await refetch();
            message.success("Game deleted");
          }
        } catch (err) {
          message.error("Error deleting game");
        } finally {
          setDeletingId("");
        }
      },
    });
  };

  const columns: ColumnsType<GameListDto> = [
    {
      title: "Game",
      key: "game",
      width: 250,
      render: (_, record: GameListDto) => (
        <Space>
          <Avatar
            src={record.image}
            size="default"
            shape="square"
            icon={<LuGamepad2 />}
          >
            {record.name[0].toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.isEloBased ? (
                <Tag color="blue">ELO-Based</Tag>
              ) : (
                <Tag color="default">Standard</Tag>
              )}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Services",
      dataIndex: "servicesCount",
      key: "servicesCount",
      width: 100,
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
      title: "Subpackages",
      dataIndex: "subpackagesCount",
      key: "subpackagesCount",
      width: 120,
      render: (count: number) => (
        <span
          style={{
            fontWeight: count > 0 ? 500 : 400,
            color: count > 0 ? "#52c41a" : "#999",
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
      title: "Avg Order Value",
      dataIndex: "averageOrderValue",
      key: "averageOrderValue",
      width: 120,
      render: (amount: number) => (
        <span style={{ color: amount > 0 ? "#1890ff" : "#999" }}>
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
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record: GameListDto) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Link href={`/admin/games/${record.id}`}>
              <Button type="text" icon={<EyeOutlined />} size="small" />
            </Link>
          </Tooltip>

          <Tooltip title="Delete">
            <Button
              disabled={record.id === deletingId}
              onClick={() => handleDeleteGame(record.id)}
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
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

  const handleEloFilter = (isEloBased: boolean | undefined) => {
    setParams((prev) => ({
      ...prev,
      isEloBased,
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

  const handleRevenueFilter = (
    min: number | undefined,
    max: number | undefined
  ) => {
    setParams((prev) => ({
      ...prev,
      minRevenue: min,
      maxRevenue: max,
      page: 1,
    }));
  };

  return (
    <div>
      {/* Statistics Cards */}
      {data?.stats && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Games"
                value={data.stats.totalGames}
                prefix={<LuGamepad2 />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Services"
                value={data.stats.totalServices}
                prefix={<ShoppingCartOutlined />}
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
                title="Most Popular"
                value={data.stats.mostPopularGame}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
        </Row>
      )}

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
              placeholder="Search games..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Select
              placeholder="ELO-based"
              allowClear
              style={{ width: 150 }}
              onChange={handleEloFilter}
            >
              <Option value={true}>ELO-based</Option>
              <Option value={false}>Standard</Option>
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
                placeholder="Min revenue"
                min={0}
                style={{ width: 120 }}
                onChange={(value) =>
                  handleRevenueFilter(value || undefined, params.maxRevenue)
                }
              />
              <InputNumber
                placeholder="Max revenue"
                min={0}
                style={{ width: 120 }}
                onChange={(value) =>
                  handleRevenueFilter(params.minRevenue, value || undefined)
                }
              />
            </Space.Compact>
            <Button icon={<FilterOutlined />}>More Filters</Button>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Add Game
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={data?.games || []}
          rowKey="id"
          loading={loading}
          pagination={{
            current: data?.page || 1,
            pageSize: data?.limit || 10,
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} games`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Create Game Modal */}
      <Modal
        title="Create New Game"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateGame}>
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

          <Form.Item>
            <Space>
              <Button disabled={createLoading} type="primary" htmlType="submit">
                {createLoading ? "Creating..." : "Create Game"}
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
