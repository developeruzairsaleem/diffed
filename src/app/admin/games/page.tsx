import { Button, Table, Space, Popconfirm, Image } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deleteGame } from './actions'

async function getGames() {
  return await prisma.game.findMany({
    orderBy: { id: 'desc' }
  })
}

export default async function GamesPage() {
  const games = await getGames()

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id: string) => id.slice(0, 8) + '...'
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image: string) => (
        <Image
          width={50}
          height={50}
          src={image}
          alt="Game image"
          style={{ objectFit: 'cover' }}
        />
      )
    },
    {
      title: 'Teammates',
      dataIndex: 'teammates',
      key: 'teammates',
    },
    {
      title: 'Sessions',
      dataIndex: 'sessions',
      key: 'sessions',
    },
    {
      title: 'Action',
      key: 'action',
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
              'use server'
              await deleteGame(record.id)
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
        <h1>Games Management</h1>
        <Link href="/admin/games/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Add Game
          </Button>
        </Link>
      </div>
      <Table 
        columns={columns} 
        dataSource={games} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}
