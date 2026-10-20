package com.reownix.chat.response;


import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationResponse {

    private Long conversationId;

    private Long productId;

    private String productTitle;

    private Long otherUserId;

    private String otherUserName;

    private String lastMessage;

    private Integer unreadCount;

    private LocalDateTime updatedAt;
}