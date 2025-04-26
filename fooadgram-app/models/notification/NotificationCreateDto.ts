export interface NotificationCreateDto {
    userId: string;
    title: string;
    content: string;
    notificationStatus: NotificationStatus;
    notificationType: NotificationType;
    targetUrl?: string;
    senderId?: string;
}

export type NotificationStatus = 'PENDING' | 'SENT' | 'READ' | 'FAILED';
export type NotificationType = 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION'; // update with your real types
