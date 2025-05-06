export interface ConversationDto {
    /** Unique conversation identifier */
    id: string;

    /** The other participant's user ID */
    otherUserId: string;

    /** The other participant's display name */
    otherUserName: string;

    /** S3 key or path to the other user's avatar image */
    otherUserAvatar: string;

    /** A short snippet of the last message in this conversation */
    lastMessageSnippet: string;

    /** ISO timestamp of the last message */
    lastMessageTime: string;

    /** Number of unread messages in this conversation */
    unreadCount: number;
}