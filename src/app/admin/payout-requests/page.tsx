"use client";
import { useEffect, useState } from "react";
import { Card, Table, Tag, Space, Button, Modal, Form, Select, message } from "antd";

type Txn = {
  id: string;
  type: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  amount: string | number;
  description?: string | null;
  createdAt: string;
  wallet: {
    id: string;
    user: { id: string; username: string; email: string };
  };
};

export default function PayoutRequestsPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Txn[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Txn | null>(null);
  const [status, setStatus] = useState<Txn["status"] | undefined>(undefined);

  const fetchData = async (p = page, l = limit) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/transactions?type=withdrawal&page=${p}&limit=${l}`);
      const js = await res.json();
      if (!res.ok || !js.success) throw new Error(js?.error || "Failed to fetch");
      setData(js.data.transactions);
      setTotal(js.data.total);
      setPage(js.data.page);
      setLimit(js.data.limit);
    } catch (e: any) {
      message.error(e?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card title="Payout Requests">
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          onChange: (p, l) => fetchData(p, l),
        }}
        columns={[
          {
            title: "Provider",
            key: "provider",
            render: (_: any, r: Txn) => (
              <div>
                <div style={{ fontWeight: 500 }}>{r.wallet.user.username}</div>
                <div style={{ color: "#888", fontSize: 12 }}>{r.wallet.user.email}</div>
              </div>
            ),
          },
          { title: "Amount", dataIndex: "amount", key: "amount", render: (v: any) => `$${parseFloat(String(v)).toFixed(2)}` },
          { title: "Description", dataIndex: "description", key: "description", render: (v: any) => v || "-" },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (s: Txn["status"]) => {
              const colors: Record<string, string> = { pending: "orange", completed: "green", failed: "red", cancelled: "default" };
              return <Tag color={colors[s]}>{s.toUpperCase()}</Tag>;
            },
          },
          {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (d: string) => new Date(d).toLocaleString(),
          },
          {
            title: "Actions",
            key: "actions",
            render: (_: any, r: Txn) => (
              <Space>
                <Button
                  size="small"
                  onClick={() => {
                    setSelected(r);
                    setStatus(r.status);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal title="Edit Status" open={editOpen} onCancel={() => setEditOpen(false)} footer={null}>
        <Form
          layout="vertical"
          onFinish={async () => {
            if (!selected) return;
            try {
              const res = await fetch(`/api/admin/transactions/${selected.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
              });
              const js = await res.json();
              if (!res.ok || !js.success) throw new Error(js?.error || "Failed");
              message.success("Status updated");
              setEditOpen(false);
              fetchData(page, limit);
            } catch (e: any) {
              message.error(e?.message || "Failed to update");
            }
          }}
        >
          <Form.Item label="Status" required>
            <Select
              value={status}
              onChange={(v) => setStatus(v)}
              options={[
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "failed", label: "Failed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Save</Button>
              <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}


