package com.reownix.chat.response;


import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {

    private Long messageId;

    private Long senderId;

    private String senderName;

    private String message;

    private Boolean isRead;

    private LocalDateTime createdAt;
}
