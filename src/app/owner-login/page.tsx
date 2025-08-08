"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Flex,
  Space,
} from "antd";
import { LockOutlined, UserOutlined, CrownOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    const { email, password } = values;

    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // antd message provides non-blocking feedback
        message.error(data.error || "Login failed. Please try again.");
      } else {
        message.success("Login Successful! Redirecting...");
        // Redirect to the admin dashboard on successful login
        router.push("/admin");
      }
    } catch (error) {
      console.error("Login request failed:", error);
      message.error(
        "An unexpected error occurred. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      style={{ minHeight: "100vh", background: "#f0f2f5" }}
    >
      <Card style={{ width: 400 }}>
        <Space
          direction="vertical"
          align="center"
          style={{ width: "100%", marginBottom: 24 }}
        >
          <CrownOutlined style={{ fontSize: 32, color: "#1890ff" }} />
          <Title level={3}>Admin Portal</Title>
          <Text type="secondary">Please log in to continue</Text>
        </Space>

        <Form
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input a valid Email!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
}
