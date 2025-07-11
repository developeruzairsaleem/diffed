'use client'

import { Button, Form, Input, Card } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { createService } from '../actions'

const { TextArea } = Input

export default function CreateServicePage() {
  const [form] = Form.useForm()

  const handleSubmit = async (values: any) => {
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('description', values.description)
    
    await createService(formData)
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/services">
          <Button icon={<ArrowLeftOutlined />}>
            Back to Services
          </Button>
        </Link>
      </div>
      
      <Card title="Create New Service">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input the service title!' }]}
          >
            <Input placeholder="Enter service title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input the service description!' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter service description" 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Service
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
