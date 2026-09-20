package com.smartprocure.service;

public interface EmailService {
    boolean sendPasswordResetEmail(String recipientEmail, String resetToken);
}
