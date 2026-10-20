package com.reownix.chat.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendMessageRequest {

    @NotBlank
    @Size(max = 2000)
    private String message;
}