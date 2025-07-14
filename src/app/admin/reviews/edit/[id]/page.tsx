"use client";

import { Button, Form, Input, Card, Rate } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { updateReview } from "../../actions";

const { TextArea } = Input;

export default function EditReviewPage() {
  const params = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`/api/reviews/${params.id}`);
        const review = await response.json();
        console.log("response recieved", review);
        form.setFieldsValue(review);
      } catch (error) {
        console.error("Error fetching review:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchReview();
    }
  }, [params.id, form]);

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("starRating", values.starRating.toString());
    formData.append("description", values.description);
    formData.append("image", values.image);
    formData.append("name", values.name);

    await updateReview(params.id as string, formData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/reviews">
          <Button icon={<ArrowLeftOutlined />}>Back to Reviews</Button>
        </Link>
      </div>

      <Card title="Edit Review">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the reviewer name!" },
            ]}
          >
            <Input placeholder="Enter reviewer name" />
          </Form.Item>

          <Form.Item
            label="Star Rating"
            name="starRating"
            rules={[
              { required: true, message: "Please select a star rating!" },
            ]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input the review description!",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Enter review description" />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ required: true, message: "Please input the image URL!" }]}
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Review
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
