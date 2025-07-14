"use client";
import { Button, Table, Space, Popconfirm, Image } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import { deleteGame } from "./actions";

export default function GamesTable({ games }: { games: any[] }) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: string) => id.slice(0, 8) + "...",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 100,
      render: (name: string) => name,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image: string) => (
        <Image
          width={50}
          height={50}
          src={image}
          alt="Game image"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Teammates",
      dataIndex: "teammates",
      key: "teammates",
    },
    {
      title: "Sessions",
      dataIndex: "sessions",
      key: "sessions",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Link href={`/admin/games/edit/${record.id}`}>
            <Button icon={<EditOutlined />} size="small">
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure to delete this game?"
            onConfirm={async () => {
              await deleteGame(record.id);
            }}
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1>Games Management</h1>
        <Link href="/admin/games/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Add Game
          </Button>
        </Link>
      </div>
      <div style={{ overflowX: "auto", minWidth: 320 }}>
        <Table
          columns={columns}
          dataSource={games}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}
