export interface ChatMessageDto {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    deleted?: boolean;
}
