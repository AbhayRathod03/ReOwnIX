package com.reownix.admin.entity;

import java.time.LocalDateTime;

import com.reownix.auth.entity.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @Column(nullable = false)
    private String reportType; // PRODUCT, USER, CHAT, REVIEW

    @Column(nullable = false)
    private Long targetId; // ID of the reported entity

    @Column(length = 1000)
    private String reason;

    @Column(nullable = false)
    @Builder.Default
    private Boolean resolved = false;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
