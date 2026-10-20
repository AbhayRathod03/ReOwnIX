package com.reownix.chat.request;


import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StartConversationRequest {

    @NotNull
    private Long productId;
}