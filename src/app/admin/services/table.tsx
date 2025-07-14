"use client";

import { Table, Space, Button, Popconfirm, Image } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useTransition } from "react";
import { deleteService } from "./actions";

export default function ServicesTable({ services }: { services: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteService(id);
      // Optionally show loading or toast
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: string) => id.slice(0, 8) + "...",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <Image src={image} alt="Service Image" width={60} height={50} />
      ),
    },

    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Link href={`/admin/services/edit/${record.id}`}>
            <Button icon={<EditOutlined />} size="small">
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure to delete this service?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Link href="/admin/services/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Add Service
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={services}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
