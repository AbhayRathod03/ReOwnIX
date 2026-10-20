package com.reownix.chat.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatNotificationDTO {
    private String type; // e.g. "NEW_MESSAGE"
    private Long conversationId;
    private String senderName;
    private String messagePreview;
}
