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
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  CalculatorOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { LuGamepad2 } from "react-icons/lu";
import type { ColumnsType } from "antd/es/table";
import { useSubpackage, usePricingCalculator } from "@/hooks/useSubpackages";
import type { SubpackageUpdateRequest } from "@/types/game.dto";
import Link from "next/link";

const { TextArea } = Input;
const { Option } = Select;

interface SubpackageDetailProps {
  subpackageId: string;
}

export default function SubpackageDetail({
  subpackageId,
}: SubpackageDetailProps) {
  const {
    data: subpackage,
    loading,
    error,
    refetch,
  } = useSubpackage(subpackageId);
  const { calculatePrice, loading: pricingLoading } = usePricingCalculator();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [pricingModalVisible, setPricingModalVisible] = useState(false);
  const [pricingResult, setPricingResult] = useState<any>(null);
  const [form] = Form.useForm();
  const [pricingForm] = Form.useForm();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!subpackage) return <div>Subpackage not found</div>;

  const handleUpdateSubpackage = async (values: SubpackageUpdateRequest) => {
    try {
      const response = await fetch(`/api/admin/subpackages/${subpackageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Subpackage updated successfully");
        setEditModalVisible(false);
        refetch();
      } else {
        message.error(result.error || "Failed to update subpackage");
      }
    } catch (err) {
      message.error("Network error occurred");
    }
  };

  const handlePricingCalculation = async (values: {
    currentELO: number;
    targetELO: number;
  }) => {
    const result = await calculatePrice(
      subpackageId,
      values.currentELO,
      values.targetELO
    );
    if (result) {
      setPricingResult(result);
    }
  };

  const orderColumns: ColumnsType<any> = [
    {
      title: "Order #",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (orderNumber: string, record: any) => (
        <Link href={`/admin/orders/${record.id}`}>
          <Button type="link" size="small">
            #{orderNumber.slice(-8)}
          </Button>
        </Link>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.customer.username}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.customer.email}
          </div>
        </div>
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
      title: "Assignments",
      key: "assignments",
      render: (_, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.completedAssignments}/{record.assignmentsCount}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>completed</div>
        </div>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
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
                  value={subpackage.stats.ordersCount}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={subpackage.stats.totalRevenue}
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
                  value={subpackage.stats.completionRate}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: "#52c41a" }}
                />
                <Progress
                  percent={subpackage.stats.completionRate}
                  showInfo={false}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Average Rating"
                  value={subpackage.stats.averageRating}
                  prefix={<StarOutlined />}
                  precision={1}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Subpackage Information">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Package Name">
                {subpackage.name}
              </Descriptions.Item>
              <Descriptions.Item label="Base Price">
                ${subpackage.price.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Service">
                {subpackage.service.name}
              </Descriptions.Item>
              <Descriptions.Item label="Game">
                <Space>
                  <Avatar
                    src={subpackage.service.game.image}
                    size="small"
                    shape="square"
                  />
                  {subpackage.service.game.name}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Duration">
                {subpackage.duration || "Not specified"}
              </Descriptions.Item>
              <Descriptions.Item label="Pricing Type">
                <Tag color={subpackage.dynamicPricing ? "blue" : "default"}>
                  {subpackage.dynamicPricing ? "Dynamic" : "Fixed"}
                </Tag>
              </Descriptions.Item>
              {subpackage.dynamicPricing && (
                <>
                  <Descriptions.Item label="Base Price per ELO">
                    ${subpackage.basePricePerELO?.toFixed(2) || "0.00"}
                  </Descriptions.Item>
                  <Descriptions.Item label="ELO Range">
                    {subpackage.minELO || "No min"} -{" "}
                    {subpackage.maxELO || "No max"}
                  </Descriptions.Item>
                </>
              )}
              <Descriptions.Item label="Average Order Value">
                ${subpackage.stats.averageOrderValue.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Completed Orders">
                {subpackage.stats.completedOrders}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {new Date(subpackage.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {new Date(subpackage.updatedAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {subpackage.description}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      ),
    },
    {
      key: "orders",
      label: `Orders (${subpackage.orders.length})`,
      children: (
        <Table
          columns={orderColumns}
          dataSource={subpackage.orders}
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
          <Link href={`/admin/games/${subpackage.service.gameId}`}>
            <Button icon={<ArrowLeftOutlined />}>Back to Game</Button>
          </Link>
          <Avatar
            src={subpackage.service.game.image}
            size="large"
            shape="square"
            icon={<LuGamepad2 />}
          >
            {subpackage.service.game.name[0].toUpperCase()}
          </Avatar>
          <div>
            <h1>{subpackage.name}</h1>
            <p style={{ margin: 0, color: "#666" }}>
              {subpackage.service.name} • {subpackage.service.game.name}
            </p>
          </div>
        </Space>
        <Space>
          {subpackage.dynamicPricing && subpackage.service.game.isEloBased && (
            <Button
              icon={<CalculatorOutlined />}
              onClick={() => setPricingModalVisible(true)}
            >
              Calculate Price
            </Button>
          )}
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue(subpackage);
              setEditModalVisible(true);
            }}
          >
            Edit Subpackage
          </Button>
        </Space>
      </div>

      <Tabs items={tabItems} />

      {/* Edit Subpackage Modal */}
      <Modal
        title="Edit Subpackage"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateSubpackage}>
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
            label="Base Price"
            rules={[{ required: true, message: "Price is required" }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="duration" label="Duration">
            <Input placeholder="e.g., 2-3 days" />
          </Form.Item>
          <Form.Item name="requiredProviders" label="Required Providers">
            <InputNumber min={0} placeholder="e.g., 4" />
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
                Update Subpackage
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Pricing Calculator Modal */}
      <Modal
        title="Dynamic Pricing Calculator"
        open={pricingModalVisible}
        onCancel={() => {
          setPricingModalVisible(false);
          setPricingResult(null);
        }}
        footer={null}
      >
        <Form
          form={pricingForm}
          layout="vertical"
          onFinish={handlePricingCalculation}
        >
          <Form.Item
            name="currentELO"
            label="Current ELO"
            rules={[{ required: true, message: "Current ELO is required" }]}
          >
            <InputNumber
              min={subpackage.minELO || 0}
              max={subpackage.maxELO || 10000}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="targetELO"
            label="Target ELO"
            rules={[{ required: true, message: "Target ELO is required" }]}
          >
            <InputNumber
              min={subpackage.minELO || 0}
              max={subpackage.maxELO || 10000}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={pricingLoading}
              block
            >
              Calculate Price
            </Button>
          </Form.Item>
        </Form>

        {pricingResult && (
          <Alert
            message="Pricing Calculation Result"
            description={
              <div>
                <Row gutter={16}>
                  <Col span={12}>
                    <strong>Base Price:</strong> $
                    {pricingResult.basePrice.toFixed(2)}
                  </Col>
                  <Col span={12}>
                    <strong>ELO Difference:</strong>{" "}
                    {pricingResult.eloDifference}
                  </Col>
                  <Col span={12}>
                    <strong>Additional Cost:</strong> $
                    {pricingResult.additionalCost.toFixed(2)}
                  </Col>
                  <Col span={12}>
                    <strong>Final Price:</strong>{" "}
                    <span style={{ color: "#52c41a", fontWeight: "bold" }}>
                      ${pricingResult.calculatedPrice.toFixed(2)}
                    </span>
                  </Col>
                </Row>
              </div>
            }
            type="success"
            style={{ marginTop: 16 }}
          />
        )}
      </Modal>
    </div>
  );
}
