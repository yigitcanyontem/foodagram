// fooadgram-app/services/feed.ts
import axios from 'axios';
import { Post } from './feed-types';
import { UserData } from '@/models/user/UserData';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.2:8083';

export async function fetchFeed(user: UserData): Promise<Post[]> {
    // 👉  use the real field name
    const token = user?.token;
    if (!token) throw new Error('missing access token');
    console.log('[feed.ts] GET', `${API}/api/v1/content/feed`);
    const res = await axios.get<Post[]>('/api/v1/content/feed', {
        baseURL: API,
        headers: { Authorization: `Bearer ${token}` }
    });


    return res.data;   // [] if nobody posted in last 24 h
}
