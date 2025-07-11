import { Button, Table, Space, Popconfirm, Image, Rate } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deleteReview } from './actions'

async function getReviews() {
  return await prisma.review.findMany({
    orderBy: { id: 'desc' }
  })
}

export default async function ReviewsPage() {
  const reviews = await getReviews()

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id: string) => id.slice(0, 8) + '...'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Rating',
      dataIndex: 'starRating',
      key: 'starRating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      ellipsis: true
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
          alt="Review image"
          style={{ objectFit: 'cover' }}
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Link href={`/admin/reviews/edit/${record.id}`}>
            <Button icon={<EditOutlined />} size="small">
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure to delete this review?"
            onConfirm={async () => {
              'use server'
              await deleteReview(record.id)
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
        <h1>Reviews Management</h1>
        <Link href="/admin/reviews/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Add Review
          </Button>
        </Link>
      </div>
      <Table 
        columns={columns} 
        dataSource={reviews} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}
