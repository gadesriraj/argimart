package com.harvesthub.repository;

import com.harvesthub.entity.AIConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIConversationRepository extends JpaRepository<AIConversation, String> {
    List<AIConversation> findByUserIdOrderByCreatedAtDesc(String userId);
}
