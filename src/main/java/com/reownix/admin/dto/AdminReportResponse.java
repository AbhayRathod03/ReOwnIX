package com.reownix.admin.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminReportResponse {
    private Long id;
    private Long reporterId;
    private String reporterName;
    private String reportType;
    private Long targetId;
    private String reason;
    private Boolean resolved;
    private LocalDateTime createdAt;
}
