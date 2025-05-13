import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentService } from '../services/content-service';
import { PostResponseDto } from '../models/content/dto/PostResponseDto';
import { CommentService } from '../services/comment-service';
import { CommentResponseDto } from '../models/content/dto/CommentResponseDto';
import { Button, Card, Form, Input, message, Space, List } from 'antd';
import { PostUpdateDto } from '../models/content/dto/PostUpdateDto';

const PostDetailsPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostResponseDto | null>(null);
    const [comments, setComments] = useState<CommentResponseDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (postId) {
            fetchPostDetails();
            fetchComments();
        }
    }, [postId]);

    const fetchPostDetails = async () => {
        try {
            setLoading(true);
            const postData = await ContentService.getPost(postId!); // We'll need to pass userData here
            setPost(postData);
            form.setFieldsValue({
                title: postData.title,
                content: postData.content,
            });
        } catch (error) {
            message.error('Failed to fetch post details');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const commentsData = await CommentService.getCommentsByPost(postId!, {}); // We'll need to pass userData here
            setComments(commentsData);
        } catch (error) {
            message.error('Failed to fetch comments');
        }
    };

    const handleUpdate = async (values: PostUpdateDto) => {
        try {
            await ContentService.updatePost(postId!, values, {}); // We'll need to pass userData here
            message.success('Post updated successfully');
            fetchPostDetails();
        } catch (error) {
            message.error('Failed to update post');
        }
    };

    const handleDelete = async () => {
        try {
            await ContentService.deletePost(postId!); // We'll need to pass userData here
            message.success('Post deleted successfully');
            navigate('/posts');
        } catch (error) {
            message.error('Failed to delete post');
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ paddingTop: '24px' }}>
            <h1>Post Details</h1>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title="Post Information">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdate}
                    >
                        <Form.Item name="title" label="Title">
                            <Input />
                        </Form.Item>
                        <Form.Item name="content" label="Content">
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Update Post
                                </Button>
                                <Button danger onClick={handleDelete}>
                                    Delete Post
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>

                <Card title="Comments">
                    <List
                        dataSource={comments}
                        renderItem={(comment: CommentResponseDto) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={comment.createdByUsername}
                                    description={comment.content}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </Space>
        </div>
    );
};

export default PostDetailsPage; 
