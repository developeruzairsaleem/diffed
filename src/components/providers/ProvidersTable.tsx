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
  Rate,
  Progress,
  Form,
  Modal,
} from "antd";
import { toast } from "sonner";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  DollarOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type {
  ProviderListDto,
  ProvidersListRequest,
} from "@/types/provider.dto";
import { Status } from "@/generated/prisma";
import { useProviders } from "@/hooks/useProviders";
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

export default function ProvidersTable() {
  const [deletingProviderId, setDeletingProviderId] = useState("");
  const [form] = Form.useForm();

  const [params, setParams] = useState<ProvidersListRequest>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, loading, error, refetch } = useProviders(params);
  // handling deleting the provider

  const handleDeleteProvider = async ({
    providerId,
  }: {
    providerId: string;
  }) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Provider?",
      okText: "Yes, delete",
      cancelText: "Cancel",
      onOk: async () => {
        setDeletingProviderId(providerId);
        try {
          const res = await fetch(`/api/admin/providers/${providerId}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Failed to delete");
          else {
            await refetch();
            toast.success("Customer deleted");
          }
        } catch (err) {
          toast.error("Error deleting customer");
        } finally {
          setDeletingProviderId("");
        }
      },
    });
  };

  const columns: ColumnsType<ProviderListDto> = [
    {
      title: "Provider",
      key: "provider",
      width: 250,
      render: (_, record: ProviderListDto) => (
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
      title: "Rating",
      dataIndex: "averageRating",
      key: "averageRating",
      width: 120,
      render: (rating: number) => (
        <Space>
          <Rate disabled defaultValue={rating} allowHalf />
          <span style={{ fontSize: "12px", color: "#666" }}>
            ({rating.toFixed(1)})
          </span>
        </Space>
      ),
    },
    {
      title: "Assignments",
      key: "assignments",
      width: 120,
      render: (_, record: ProviderListDto) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.completedAssignments}/{record.assignmentsCount}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.activeAssignments > 0 && (
              <Tag color="blue">{record.activeAssignments} active</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Completion Rate",
      key: "completionRate",
      width: 120,
      render: (_, record: ProviderListDto) => {
        const rate =
        record.assignmentsCount > 0
        ? (record.completedAssignments / record.assignmentsCount) * 100
            : 0;
        return (
          <Progress
          percent={rate}
            size="small"
            format={(percent) => `${percent?.toFixed(0)}%`}
          />
        );
      },
    },
    {
      title: "Total Earnings",
      dataIndex: "totalEarnings",
      key: "totalEarnings",
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
      title: "Wallet Balance",
      key: "balance",
      width: 120,
      render: (_, record: ProviderListDto) => (
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
      title: "Last Assignment",
      dataIndex: "lastAssignmentDate",
      key: "lastAssignmentDate",
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
      title: "Activate",
      key: "activate",
      width: 140,
      render: (_, record: ProviderListDto) => (
        <Select
          value={record.status}
          style={{ width: 120 }}
          onChange={async (value) => {
            try {
              const res = await fetch(`/api/admin/providers/${record.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: value }),
              });
              const result = await res.json();
              if (!res.ok || !result.success) {
                toast.error(result.error || "Error updating status");
              }
              if (res.ok && result.success) {
                toast.success(result.message || "Provider status updated");
                await refetch();
              }
            } catch (err) {
              toast.error("Error updating status");
            }
          }}
        >
          <Option value={Status.active}>{statusLabels[Status.active]}</Option>
          <Option value={Status.inactive}>{statusLabels[Status.inactive]}</Option>
          <Option value={Status.suspended}>{statusLabels[Status.suspended]}</Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record: ProviderListDto) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Link href={`/admin/providers/${record.id}`}>
              <Button type="text" icon={<EyeOutlined />} size="small" />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              loading={deletingProviderId === record.id}
              onClick={() => handleDeleteProvider({ providerId: record.id })}
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

  const handleStatusFilter = (status: Status | undefined) => {
    setParams((prev) => ({
      ...prev,
      status,
      page: 1,
    }));
  };

  const handleAssignmentsFilter = (hasAssignments: boolean | undefined) => {
    setParams((prev) => ({
      ...prev,
      hasAssignments,
      page: 1,
    }));
  };

  const handleAvailabilityFilter = (isAvailable: boolean | undefined) => {
    setParams((prev) => ({
      ...prev,
      isAvailable,
      page: 1,
    }));
  };

  const handleEarningsFilter = (
    min: number | undefined,
    max: number | undefined
  ) => {
    setParams((prev) => ({
      ...prev,
      minEarnings: min,
      maxEarnings: max,
      page: 1,
    }));
  };

  const handleRatingFilter = (minRating: number | undefined) => {
    setParams((prev) => ({
      ...prev,
      minRating,
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
                title="Total Providers"
                value={data.stats.totalProviders}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active Providers"
                value={data.stats.activeProviders}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Earnings Paid"
                value={data.stats.totalEarningsPaid}
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
                value={data.stats.averageProviderRating}
                prefix={<StarOutlined />}
                precision={1}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search providers..."
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
              placeholder="Has assignments"
              allowClear
              style={{ width: 150 }}
              onChange={handleAssignmentsFilter}
            >
              <Option value={true}>Has Assignments</Option>
              <Option value={false}>No Assignments</Option>
            </Select>

            <Space.Compact>
              <InputNumber
                placeholder="Min earnings"
                min={0}
                style={{ width: 120 }}
                onChange={(value) =>
                  handleEarningsFilter(value || undefined, params.maxEarnings)
                }
              />
              <InputNumber
                placeholder="Max earnings"
                min={0}
                style={{ width: 120 }}
                onChange={(value) =>
                  handleEarningsFilter(params.minEarnings, value || undefined)
                }
              />
            </Space.Compact>
            <InputNumber
              placeholder="Min rating"
              min={0}
              max={5}
              step={0.1}
              style={{ width: 120 }}
              onChange={(value) => handleRatingFilter(value || undefined)}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={data?.providers || []}
          rowKey="id"
          loading={loading}
          pagination={{
            current: data?.page || 1,
            pageSize: data?.limit || 10,
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} providers`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
        />
      </Card>
    </div>
  );
}
