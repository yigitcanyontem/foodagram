// fooadgram-app/services/feed.ts
import axios from 'axios';
import { Post } from './feed-types';
import { UserData } from '@/models/user/UserData';
import { GlobalConstants } from '@/utils/GlobalConstants';

const API = process.env.EXPO_PUBLIC_API_URL ?? GlobalConstants.baseUrl;

export async function fetchFeed(user: UserData, page: number = 1, limit: number = 10): Promise<Post[]> {
    const token = user?.token;
    if (!token) throw new Error('missing access token');

    const res = await axios.get<Post[]>('/content/feed', {
        baseURL: API,
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },  // Send pagination parameters to the backend
    });

    return res.data;  // Return the array of posts
}
