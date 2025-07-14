'use client'

import { Button, Form, Input, Card } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { updateService } from '../../actions'

const { TextArea } = Input

export default function EditServicePage() {
  const params = useParams()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [service, setService] = useState<any>(null)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${params.id}`)
        const service = await response.json();
        console.log('service fetch data: ', service)
        setService(service)
        form.setFieldsValue(service)
      } catch (error) {
        console.error('Error fetching service:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchService()
    }
  }, [params.id, form])

  const handleSubmit = async (values: any) => {
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('description', values.description)
    formData.append('image', values.image)
    await updateService(params.id as string, formData)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!service) {
    return <div>No service found.</div>
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
      <Card title="Edit Service">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 600 }}
          initialValues={service}
        >
          <Form.Item label='image' name='image'>
            <Input placeholder='Enter image url' />
          </Form.Item>
          <Form.Item
            label="Title"
            name="title"
            
          >
            <Input placeholder="Enter service title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            
          >
            <TextArea rows={4} placeholder="Enter service description" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Service
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}