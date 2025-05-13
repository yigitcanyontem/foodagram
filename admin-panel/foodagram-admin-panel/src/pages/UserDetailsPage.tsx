import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserService } from '../services/user-service';
import { UsersProfileDto } from '../models/user/UsersProfileDto';
import { Button, Card, Form, Input, message, Space } from 'antd';
import { ContentService } from '../services/content-service';
import { PostResponseDto } from '../models/content/dto/PostResponseDto';

const UserDetailsPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<UsersProfileDto | null>(null);
    const [posts, setPosts] = useState<PostResponseDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (userId) {
            fetchUserDetails();
            fetchUserPosts();
        }
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const userData = await UserService.getUserProfileByUserId(userId!);
            setUser(userData);
            form.setFieldsValue(userData);
        } catch (error) {
            message.error('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const postsData = await ContentService.getAllPostsByUser(userId!);
            setPosts(postsData);
        } catch (error) {
            message.error('Failed to fetch user posts');
        }
    };

    const handleUpdate = async (values: any) => {
        try {
            await UserService.updateUserProfile(values); // We'll need to pass userData here
            message.success('User updated successfully');
            fetchUserDetails();
        } catch (error) {
            message.error('Failed to update user');
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ paddingTop: '24px' }}>
            <h1>User Details</h1>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title="Profile Information">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdate}
                        initialValues={user}
                    >
                        <Form.Item name="username" label="Username">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="email" label="Email">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="fullName" label="Full Name">
                            <Input />
                        </Form.Item>
                        <Form.Item name="bio" label="Bio">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Update Profile
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                <Card title="User Posts">
                    {posts.map(post => (
                        <Card.Grid key={post.id} style={{ width: '100%' }}>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <Button type="link" onClick={() => navigate(`/posts/${post.id}`)}>
                                View Details
                            </Button>
                        </Card.Grid>
                    ))}
                </Card>
            </Space>
        </div>
    );
};

export default UserDetailsPage; 
