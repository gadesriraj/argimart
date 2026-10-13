package com.harvesthub.repository;

import com.harvesthub.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, String> {
    List<Feedback> findByProductIdOrderByCreatedAtDesc(String productId);
}
