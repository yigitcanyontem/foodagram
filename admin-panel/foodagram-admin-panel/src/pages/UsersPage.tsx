import React, { useEffect, useState } from 'react';
import { UserService } from '../services/user-service';
import { UsersCompleteDto } from '../models/user/UsersCompleteDto';
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
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from '../components/ui/alert-dialog';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<UsersCompleteDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await UserService.getAllUsersProfiles();
            setUsers(response);
        } catch (error) {
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedUserId) return;
        try {
            // Call the delete API here if implemented
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to delete user');
        } finally {
            setSelectedUserId(null);
        }
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: ['user', 'username'],
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: 'email',
        },
        {
            title: 'Name',
            dataIndex: ['profile', 'firstName'],
            key: 'fullName',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: UsersCompleteDto) => (
                <div>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/users/${record.user.id}`)}
                    />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => setSelectedUserId(record.user.id)}
                            />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this user? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setSelectedUserId(null)}>Cancel</AlertDialogCancel>
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
        <div style={{ paddingTop: '24px' }}>
            <h1>Users</h1>
            <Table
                dataSource={users}
                columns={columns}
                loading={loading}
                rowKey="userId"
            />
        </div>
    );
};

export default UsersPage;
