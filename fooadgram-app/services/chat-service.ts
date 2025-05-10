import axios from "axios";
import { GlobalConstants } from "@/utils/GlobalConstants";
import { ConversationDto } from "@/models/Chat/ConversationDto";
import { UsersProfileDto } from "@/models/user/UsersProfileDto";
import { ChatMessageDto } from "@/models/Chat/ChatMessageDto";
import { UserService } from "@/services/user-service";
import ReportModal from "@/app/shared/content/ReportModal";
import {ReportType} from "@/models/content/dto/ReportType";
import { ReportReason } from "@/models/content/dto/ReportReason";



export class ChatService {
    private static baseUrl = GlobalConstants.baseUrl + "chat/";
    private static auth(user: any) {
        return { Authorization: `Bearer ${user?.token ?? ""}` };
    }


    /** REST – all conversations with pagination support */
    static getMyConversations(user: any, page = 0, size = 10): Promise<ConversationDto[]> {
        return axios
            .get(this.baseUrl + "/conversations", {
                headers: this.auth(user),
                params: { page, size },
            })
            .then((r) => r.data)
            .catch((e) => {
                console.error("getMyConversations failed", e);
                throw e;
            });
    }


    /** Fallback – people I follow that do *not* yet have a conversation */
    static getStartableChats(user: any): Promise<UsersProfileDto[]> {
        return UserService.getUserFollowing(user.id)
            .catch((e) => {
                console.error("getStartableChats failed", e);
                return [];
            });
    }


    /** Historical messages with pagination support */
    static getHistory(user: any, convId: string, page = 0, size = 50): Promise<ChatMessageDto[]> {
        return axios
            .get<ChatMessageDto[]>(
                `${this.baseUrl}/${convId}/messages`,
                {
                    headers: this.auth(user),
                    params: { page, size },
                }
            )
            .then((r) => r.data)
            .catch((e) => {
                console.error("getHistory failed", e);
                throw e;
            });
    }


    /** Delete a message */

    static deleteMessage(user: any, messageId: string): Promise<void> {
        return axios
            .delete(`${this.baseUrl}messages/${messageId}`, {
                headers: this.auth(user),
            })
            .then(() => {})
            .catch((e) => {
                console.error("deleteMessage failed", e);
                throw e;
            });
    }


    /** Report a message */
    static reportMessage(
        user: any,
        msgId: string,
        reason: ReportReason,
        notes = ""
    ) {
        return axios
            .post(
                `${this.baseUrl}/messages/${msgId}/report`,
                { reason, notes },
                { headers: this.auth(user) }
            )
            .catch((e) => {
                console.error("reportMessage failed", e);
                throw e;
            });
    }
}
