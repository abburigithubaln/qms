package com.qms.queue.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TokenResponse {
    private Long id;
    private String tokenId;
    private Integer sequence;
    private Integer queuePosition;
    private String status;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String candidateMobile;
    private Long cabinId;
    private String cabinName;
    private LocalDateTime createdAt;
    private LocalDateTime calledAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
