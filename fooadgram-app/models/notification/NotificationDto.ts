import {NotificationStatus, NotificationType} from "@/models/notification/NotificationCreateDto";

export interface NotificationDto {
    id: string; // UUID
    userId: string;
    title: string;
    content: string;
    notificationStatus: NotificationStatus;
    notificationType: NotificationType;
    targetUrl?: string;
    senderId?: string;
    createdDate: string; // ISO string (e.g., "2025-04-26T14:00:00Z")
    updatedDate: string;
    mediaUrl: string;
}
