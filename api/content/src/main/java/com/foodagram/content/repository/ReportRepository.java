package com.foodagram.content.repository;

import com.foodagram.content.domain.Comment;
import com.foodagram.content.domain.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findByResolved(boolean b);
}
