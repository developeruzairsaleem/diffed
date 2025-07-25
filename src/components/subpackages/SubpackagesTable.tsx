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
  Row,
  Col,
  Modal,
  Form,
  InputNumber,
  Switch,
  message,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import { LuGamepad2 } from "react-icons/lu";
import type { ColumnsType } from "antd/es/table";
import { useSubpackages } from "@/hooks/useSubpackages";
import type { SubpackageCreateRequest } from "@/types/game.dto";
import Link from "next/link";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

export default function SubpackagesTable() {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentGameId, setCurrentGameId] = useState("");
  const [currentService, setCurrentService] = useState("");
  const { data, loading, error, refetch } = useSubpackages();

  const handleCreateSubpackage = async (values: SubpackageCreateRequest) => {
    try {
      const response = await fetch("/api/admin/subpackages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Subpackage created successfully");
        setCreateModalVisible(false);
        form.resetFields();
        refetch();
      } else {
        message.error(result.error || "Failed to create subpackage");
      }
    } catch (err) {
      message.error("Network error occurred");
    }
  };

  const handleDeleteSubpackage = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/subpackages/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        message.success("Subpackage deleted successfully");
        refetch();
      } else {
        message.error(result.error || "Failed to delete subpackage");
      }
    } catch (err) {
      message.error("Network error occurred");
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Package",
      key: "package",
      width: 300,
      render: (_, record: any) => (
        <Space>
          <Avatar
            src={record.service.game.image}
            size="default"
            shape="square"
            icon={<LuGamepad2 />}
          >
            {record.service.game.name[0].toUpperCase()}
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
      title: "Service",
      key: "service",
      width: 150,
      render: (_, record: any) => (
        <div>
          <Link href={`/admin/services/${record.serviceId}`}>
            <Button type="link" size="small">
              {record.service.name}
            </Button>
          </Link>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.service.game.name}
          </div>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (price: number) => (
        <span style={{ fontWeight: 500, color: "#52c41a" }}>
          ${price.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Pricing",
      dataIndex: "dynamicPricing",
      key: "dynamicPricing",
      width: 100,
      render: (dynamic: boolean, record: any) => (
        <div>
          <Tag color={dynamic ? "blue" : "default"}>
            {dynamic ? "Dynamic" : "Fixed"}
          </Tag>
          {dynamic && record.basePricePerELO && (
            <div style={{ fontSize: "11px", color: "#666" }}>
              +${record.basePricePerELO}/ELO
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 100,
      render: (duration: string | undefined) => duration || "-",
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
      width: 100,
      render: (amount: number) => (
        <span
          style={{ fontWeight: 500, color: amount > 0 ? "#52c41a" : "#999" }}
        >
          ${amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Completion",
      dataIndex: "completionRate",
      key: "completionRate",
      width: 100,
      render: (rate: number) => (
        <span
          style={{
            color: rate > 80 ? "#52c41a" : rate > 50 ? "#faad14" : "#ff4d4f",
          }}
        >
          {rate.toFixed(1)}%
        </span>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record: any) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Link href={`/admin/subpackages/${record.id}`}>
              <Button type="text" icon={<EyeOutlined />} size="small" />
            </Link>
          </Tooltip>
          {record.dynamicPricing && (
            <Tooltip title="Calculate Price">
              <Button type="text" icon={<CalculatorOutlined />} size="small" />
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: "Delete Subpackage",
                  content: `Are you sure you want to delete "${record.name}"?`,
                  onOk: () => handleDeleteSubpackage(record.id),
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

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
              placeholder="Search subpackages..."
              allowClear
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Select
              placeholder="Filter by pricing"
              allowClear
              style={{ width: 150 }}
            >
              <Option value={true}>Dynamic Pricing</Option>
              <Option value={false}>Fixed Pricing</Option>
            </Select>
            <Button icon={<FilterOutlined />}>More Filters</Button>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Add Subpackage
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={data?.subpackages || []}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} subpackages`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Create Subpackage Modal */}
      <Modal
        title="Create New Subpackage"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubpackage}>
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
            label="Game"
            rules={[{ required: true, message: "Game is required" }]}
          >
            <Select onChange={setCurrentGameId} placeholder="Select a Game">
              {data?.allGames.map((game) => (
                <Option value={game.id} key={game.id}>
                  {game.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="serviceId"
            label="Service"
            rules={[{ required: true, message: "Service is required" }]}
          >
            <Select onChange={setCurrentService} placeholder="Select a Service">
              {data?.allGames
                ?.filter((g) => g.id === currentGameId)[0]
                ?.services.map((service) => (
                  <Option value={service.id} key={service.id}>
                    {service.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Base Price"
                rules={[{ required: true, message: "Price is required" }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: "100%" }}
                  prefix="$"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="duration" label="Duration">
                <Input placeholder="e.g., 2-3 days" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="dynamicPricing"
            label="Enable Dynamic Pricing"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item dependencies={["dynamicPricing"]} noStyle>
            {({ getFieldValue }) =>
              getFieldValue("dynamicPricing") && (
                <>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item name="basePricePerELO" label="Price per ELO">
                        <InputNumber
                          min={0}
                          step={0.01}
                          style={{ width: "100%" }}
                          prefix="$"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="minELO" label="Min ELO">
                        <InputNumber min={0} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="maxELO" label="Max ELO">
                        <InputNumber min={0} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )
            }
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Subpackage
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
