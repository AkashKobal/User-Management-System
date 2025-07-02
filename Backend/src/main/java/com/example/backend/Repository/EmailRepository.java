package com.example.backend.Repository;

import com.example.backend.Models.NewUsers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailRepository extends JpaRepository<NewUsers,Long> {
    NewUsers findByEmail(String email);
}
