import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/content-service';
import { PostResponseDto } from '../models/content/dto/PostResponseDto';
import { useNavigate } from 'react-router-dom';
import { Button, Table, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription, AlertDialogCancel,AlertDialogAction
} from '../components/ui/alert-dialog';

const PostsPage: React.FC = () => {
    const [posts, setPosts] = useState<PostResponseDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await ContentService.getAllPosts();
            setPosts(response);
        } catch (error) {
            message.error('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedPostId) return;
        try {
            await ContentService.deletePost(selectedPostId);
            message.success('Post deleted successfully');
            fetchPosts();
        } catch (error) {
            message.error('Failed to delete post');
        } finally {
            setSelectedPostId(null);
        }
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Author',
            dataIndex: 'username',
            key: 'author',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: PostResponseDto) => (
                <div>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/posts/${record.id}`)}
                    />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => setSelectedPostId(record.id)}
                            />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this post? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setSelectedPostId(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction type="primary" danger onClick={handleDelete}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h1>Posts</h1>
            <Table
                dataSource={posts}
                columns={columns}
                loading={loading}
                rowKey="id"
            />
        </div>
    );
};

export default PostsPage;
