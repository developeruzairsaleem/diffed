'use client'

import { Button, Form, Input, Card, Rate } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { createReview } from '../actions'

const { TextArea } = Input

export default function CreateReviewPage() {
  const [form] = Form.useForm()

  const handleSubmit = async (values: any) => {
    const formData = new FormData()
    formData.append('starRating', values.starRating.toString())
    formData.append('description', values.description)
    formData.append('image', values.image)
    formData.append('name', values.name)
    
    await createReview(formData)
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/reviews">
          <Button icon={<ArrowLeftOutlined />}>
            Back to Reviews
          </Button>
        </Link>
      </div>
      
      <Card title="Create New Review">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the reviewer name!' }]}
          >
            <Input placeholder="Enter reviewer name" />
          </Form.Item>

          <Form.Item
            label="Star Rating"
            name="starRating"
            rules={[{ required: true, message: 'Please select a star rating!' }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input the review description!' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter review description" 
            />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ required: true, message: 'Please input the image URL!' }]}
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Review
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
