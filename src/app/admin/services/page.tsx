import { Button, Table, Space, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deleteService } from './actions'

async function getServices() {
  return await prisma.service.findMany({
    orderBy: { id: 'desc' }
  })
}

export default async function ServicesPage() {
  const services = await getServices()

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id: string) => id.slice(0, 8) + '...'
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Link href={`/admin/services/edit/${record.id}`}>
            <Button icon={<EditOutlined />} size="small">
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure to delete this service?"
            onConfirm={async () => {
              'use server'
              await deleteService(record.id)
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
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Services Management</h1>
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
  )
}
