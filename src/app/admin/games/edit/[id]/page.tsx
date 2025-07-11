'use client'

import { Button, Form, Input, InputNumber, Card } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { updateGame } from '../../actions'

export default function EditGamePage() {
  const params = useParams()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/games/${params.id}`)
        const game = await response.json()
        form.setFieldsValue(game)
      } catch (error) {
        console.error('Error fetching game:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchGame()
    }
  }, [params.id, form])

  const handleSubmit = async (values: any) => {
    const formData = new FormData()
    formData.append('image', values.image)
    formData.append('teammates', values.teammates.toString())
    formData.append('sessions', values.sessions.toString())
    
    await updateGame(params.id as string, formData)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/games">
          <Button icon={<ArrowLeftOutlined />}>
            Back to Games
          </Button>
        </Link>
      </div>
      
      <Card title="Edit Game">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ required: true, message: 'Please input the game image URL!' }]}
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>

          <Form.Item
            label="Teammates"
            name="teammates"
            rules={[{ required: true, message: 'Please input the number of teammates!' }]}
          >
            <InputNumber 
              min={0} 
              placeholder="Number of teammates" 
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Sessions"
            name="sessions"
            rules={[{ required: true, message: 'Please input the number of sessions!' }]}
          >
            <InputNumber 
              min={0} 
              placeholder="Number of sessions" 
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Game
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
