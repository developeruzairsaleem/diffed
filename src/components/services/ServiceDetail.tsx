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
  InputNumber,
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
  PlusOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { LuGamepad2 } from "react-icons/lu";
import type { ColumnsType } from "antd/es/table";
import { useService } from "@/hooks/useGames";
import type {
  ServiceUpdateRequest,
  SubpackageCreateRequest,
} from "@/types/game.dto";
import Link from "next/link";

const { TextArea } = Input;
const { Option } = Select;

interface ServiceDetailProps {
  serviceId: string;
}

export default function ServiceDetail({ serviceId }: ServiceDetailProps) {
  const { data: service, loading, error, refetch } = useService(serviceId);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [subpackageModalVisible, setSubpackageModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [subpackageForm] = Form.useForm();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!service) return <div>Service not found</div>;

  const handleUpdateService = async (values: ServiceUpdateRequest) => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Service updated successfully");
        setEditModalVisible(false);
        refetch();
      } else {
        message.error(result.error || "Failed to update service");
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
        body: JSON.stringify({ ...values, serviceId }),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Subpackage created successfully");
        setSubpackageModalVisible(false);
        subpackageForm.resetFields();
        refetch();
      } else {
        message.error(result.error || "Failed to create subpackage");
      }
    } catch (err) {
      message.error("Network error occurred");
    }
  };

  const subpackageColumns: ColumnsType<any> = [
    {
      title: "Package Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: any) => (
        <Link href={`/admin/subpackages/${record.id}`}>
          <Button type="link" style={{ padding: 0, fontWeight: 500 }}>
            {name}
          </Button>
        </Link>
      ),
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
    {
      title: "Rating",
      dataIndex: "averageRating",
      key: "averageRating",
      render: (rating: number) => (
        <span style={{ color: rating > 0 ? "#faad14" : "#999" }}>
          {rating > 0 ? `${rating.toFixed(1)} ⭐` : "No ratings"}
        </span>
      ),
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
                  title="Total Subpackages"
                  value={service.stats.totalSubpackages}
                  prefix={<AppstoreOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Orders"
                  value={service.stats.totalOrders}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={service.stats.totalRevenue}
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
                  value={service.stats.completionRate}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: "#52c41a" }}
                />
                <Progress
                  percent={service.stats.completionRate}
                  showInfo={false}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Service Information">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Service Name">
                {service.name}
              </Descriptions.Item>
              <Descriptions.Item label="Game">
                <Space>
                  <Avatar
                    src={service.game.image}
                    size="small"
                    shape="square"
                  />
                  <Link href={`/admin/games/${service.gameId}`}>
                    <Button type="link" size="small">
                      {service.game.name}
                    </Button>
                  </Link>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Total Subpackages">
                {service.stats.totalSubpackages}
              </Descriptions.Item>
              <Descriptions.Item label="Average Order Value">
                ${service.stats.averageOrderValue.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Completed Orders">
                {service.stats.completedOrders}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {new Date(service.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {new Date(service.updatedAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {service.description}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      ),
    },
    {
      key: "subpackages",
      label: `Subpackages (${service.subpackages.length})`,
      children: (
        <div>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setSubpackageModalVisible(true)}
            >
              Add Subpackage
            </Button>
          </div>
          <Table
            columns={subpackageColumns}
            dataSource={service.subpackages}
            rowKey="id"
          />
        </div>
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
          <Link href="/admin/services">
            <Button icon={<ArrowLeftOutlined />}>Back to Services</Button>
          </Link>
          <Avatar
            src={service.game.image}
            size="large"
            shape="square"
            icon={<LuGamepad2 />}
          >
            {service.game.name[0].toUpperCase()}
          </Avatar>
          <div>
            <h1>{service.name}</h1>
            <p style={{ margin: 0, color: "#666" }}>
              {service.game.name} • {service.subpackages.length} subpackages
            </p>
          </div>
        </Space>
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue(service);
              setEditModalVisible(true);
            }}
          >
            Edit Service
          </Button>
        </Space>
      </div>

      <Tabs items={tabItems} />

      {/* Edit Service Modal */}
      <Modal
        title="Edit Service"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateService}>
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
                Update Service
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
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
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="requiredProviders"
            label="Required Providers"
            rules={[
              { required: true, message: "Providers number is required" },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
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
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="minELO" label="Minimum ELO">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="maxELO" label="Maximum ELO">
            <InputNumber min={0} style={{ width: "100%" }} />
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
