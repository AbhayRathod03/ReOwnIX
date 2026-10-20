package com.reownix.auction.websocket.dto;


import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketErrorMessage {

    private boolean success;
    private String message;
}
