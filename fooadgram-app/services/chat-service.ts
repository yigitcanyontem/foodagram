import axios from "axios";
import { GlobalConstants } from "@/utils/GlobalConstants";
import { ConversationDto } from "@/models/Chat/ConversationDto";
import { UsersProfileDto } from "@/models/user/UsersProfileDto";
import { ChatMessageDto } from "@/models/Chat/ChatMessageDto";
import { UserService } from "@/services/user-service";

export class ChatService {
    private static baseUrl = GlobalConstants.baseUrl + "chat";
    private static auth(user: any) {
        return { Authorization: user?.token ?? "" };
    }

    /** REST – all conversations that already exist */
    static getMyConversations(user: any): Promise<ConversationDto[]> {
        return axios
            .get(this.baseUrl + "/conversations", { headers: this.auth(user) })
            .then((r) => r.data);
    }

    /** Fallback – people I follow that do *not* yet have a conversation */
    static getStartableChats(user: any): Promise<UsersProfileDto[]> {
        return UserService.getUserFollowing(user.id);
    }

    /** Last 50 historical messages */
    static getHistory(user: any, convId: string) {
        return axios
            .get<ChatMessageDto[]>(
                `${this.baseUrl}/${convId}/messages`,      //  ←  NO extra “/conversations”
                { headers: this.auth(user) }
            )
            .then((r) => r.data);
    }
}
