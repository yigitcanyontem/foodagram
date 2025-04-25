// fooadgram-app/services/feed.ts
import axios from 'axios';
import { Post } from './feed-types';
import { UserData } from '@/models/user/UserData';
import { GlobalConstants } from '@/utils/GlobalConstants';

const API = process.env.EXPO_PUBLIC_API_URL ?? GlobalConstants.baseUrl;

export async function fetchFeed(user: UserData): Promise<Post[]> {
    // 👉  use the real field name
    const token = user?.token;
    if (!token) throw new Error('missing access token');
    console.log('[feed.ts] GET', `${API}/content/feed`);
    const res = await axios.get<Post[]>('/content/feed', {
        baseURL: API,
        headers: { Authorization: `Bearer ${token}` }
    });


    return res.data;   // [] if nobody posted in last 24 h
}
