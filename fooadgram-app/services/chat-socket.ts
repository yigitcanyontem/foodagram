import { Client, IMessage } from "@stomp/stompjs";
import { GlobalConstants } from "@/utils/GlobalConstants";
import { ChatMessageDto } from "@/models/Chat/ChatMessageDto";

/** one physical WebSocket for the whole app */
class ChatSocket {
    private client: Client | null = null;
    /** JWT that was used to open the *current* socket */
    private currentToken: string | null = null;

    /* ------------------------------------------------------------ */
    /*  connect / reconnect                                          */
    /* ------------------------------------------------------------ */
    connect(token: string, onConnected?: () => void) {
        /* ────────────────────────────────────────────────────────────
           1) already connected with **the same** token → nothing to do
        ──────────────────────────────────────────────────────────── */
        if (this.client?.connected && token === this.currentToken) {
            onConnected?.();
            return;
        }

        /* ────────────────────────────────────────────────────────────
           2) connected, but token has changed (logged into a new user)
              → completely tear down the old socket
        ──────────────────────────────────────────────────────────── */
        if (this.client?.connected && token !== this.currentToken) {
            this.client.deactivate();          // closes WS & unsubscribes
            this.client = null;
            this.currentToken = null;
        }

        /* ────────────────────────────────────────────────────────────
           3) open a fresh socket
        ──────────────────────────────────────────────────────────── */
        const gatewayRoot = GlobalConstants.baseUrl.replace(/\/api.*$/, "");
        this.currentToken = token;

        this.client = new Client({
            webSocketFactory: () =>
                new WebSocket(
                    `${gatewayRoot.replace(/^http/, "ws")}/chat/ws?token=${encodeURIComponent(token)}`,
                    ["v12.stomp", "v11.stomp", "v10.stomp"]
                ),

            connectHeaders: { Authorization: `Bearer ${token}` },
            forceBinaryWSFrames: true,

            debug: (msg) => console.log("[STOMP]", msg),
            onWebSocketError:  (e) => console.error("[WS] error", e),
            onWebSocketClose:  (e) => console.warn ("[WS] closed", e),

            onConnect: onConnected,
            onStompError: (f) => console.error("STOMP error", f),
        });

        this.client.activate();
    }

    /* ------------------------------------------------------------ */
    /*  subscriptions                                                */
    /* ------------------------------------------------------------ */
    /** room topic */
    subscribe(convId: string, cb: (m: ChatMessageDto) => void) {
        if (!this.client?.connected || !convId) return null;
        return this.client.subscribe(`/topic/room.${convId}`, (f: IMessage) =>
            cb(JSON.parse(f.body))
        );
    }

    /** personal queue (/user/queue/chat) */
    subscribeUserQueue(cb: (m: ChatMessageDto) => void) {
        if (!this.client?.connected) return null;
        return this.client.subscribe("/user/queue/chat", (f: IMessage) =>
            cb(JSON.parse(f.body))
        );
    }

    /* ------------------------------------------------------------ */
    /*  publishing                                                   */
    /* ------------------------------------------------------------ */
    sendMessage(dto: ChatMessageDto) {
        this.client?.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(dto),
        });
    }

    /* ------------------------------------------------------------ */
    /*  log‑out helper                                               */
    /* ------------------------------------------------------------ */
    disconnect() {
        this.client?.deactivate();
        this.client = null;
        this.currentToken = null;
    }
}

export const chatSocket = new ChatSocket();
