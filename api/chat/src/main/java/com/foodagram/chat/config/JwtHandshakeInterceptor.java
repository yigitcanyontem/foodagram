package com.foodagram.chat.config;

import com.foodagram.clients.auth.AuthClient;
import com.foodagram.clients.users.dto.UsersDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;
@Component
@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    @Autowired
    private AuthClient authClient;   // same Feign client as in notification

    @Override
    public boolean beforeHandshake(ServerHttpRequest req,
                                   ServerHttpResponse res,
                                   WebSocketHandler handler,
                                   Map<String, Object> attrs) {

        // 1️⃣ try normal Authorization header first
        List<String> auth = req.getHeaders().get(HttpHeaders.AUTHORIZATION);
        String jwt = (auth != null && !auth.isEmpty()) ? auth.get(0) : null;

        // 2️⃣ fall back to ?token= query param
        if (jwt == null) {
            URI uri = req.getURI();
            MultiValueMap<String, String> qs = UriComponentsBuilder.fromUri(uri).build().getQueryParams();
            jwt = qs.getFirst("token");
            if (jwt != null && !jwt.startsWith("Bearer "))
                jwt = "Bearer " + jwt;
        }

        if (jwt == null) {
            res.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        UsersDto user = authClient.validateToken(jwt).getBody();
        if (user == null) {
            res.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        attrs.put("user", user);   // stash for controllers
        return true;
    }

    @Override public void afterHandshake(ServerHttpRequest r, ServerHttpResponse s,
                                         WebSocketHandler h, Exception ex) {}
}
