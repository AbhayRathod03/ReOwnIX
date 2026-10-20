package com.reownix.chat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reownix.auth.entity.User;
import com.reownix.chat.entity.Conversation;
import com.reownix.chat.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationOrderByCreatedAtAsc(
            Conversation conversation);

    long countByConversationAndIsReadFalseAndSenderNot(
            Conversation conversation,
            User sender);

    List<Message> findByConversationAndIsReadFalseAndSenderNot(
            Conversation conversation,
            User sender);

    Message findTopByConversationOrderByCreatedAtDesc(
            Conversation conversation);
}
