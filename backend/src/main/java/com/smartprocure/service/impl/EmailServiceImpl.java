package com.smartprocure.service.impl;

import com.smartprocure.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.username:no-reply@smartprocure.com}")
    private String fromEmail;

    public EmailServiceImpl(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public boolean sendPasswordResetEmail(String recipientEmail, String resetToken) {
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
        String subject = "SmartProcure - Password Reset Request";
        
        String htmlBody = "<html><body style=\"font-family: Arial, sans-serif; background-color: #090d16; color: #f8fafc; padding: 20px;\">" +
                "<div style=\"max-width: 500px; margin: 0 auto; background-color: #141c2e; padding: 30px; border-radius: 12px; border: 1px solid #1c263d;\">" +
                "<h2 style=\"color: #38bdf8; margin-bottom: 10px;\">SmartProcure</h2>" +
                "<h3 style=\"color: #f8fafc;\">Password Reset Request</h3>" +
                "<p style=\"color: #94a3b8; font-size: 14px; line-height: 1.5;\">We received a request to reset your password for your SmartProcure account. Click the button below to choose a new password:</p>" +
                "<div style=\"text-align: center; margin: 25px 0;\">" +
                "<a href=\"" + resetLink + "\" style=\"background-color: #38bdf8; color: #0f172a; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;\">Reset Password</a>" +
                "</div>" +
                "<p style=\"color: #64748b; font-size: 12px;\">Or copy and paste this link into your browser:<br>" +
                "<a href=\"" + resetLink + "\" style=\"color: #38bdf8;\">" + resetLink + "</a></p>" +
                "<p style=\"color: #64748b; font-size: 12px; margin-top: 20px;\">This link is valid for 24 hours. If you did not request this reset, you can safely ignore this email.</p>" +
                "</div></body></html>";

        try {
            if (mailSender != null) {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail);
                helper.setTo(recipientEmail);
                helper.setSubject(subject);
                helper.setText(htmlBody, true);
                
                mailSender.send(message);
                log.info("Successfully sent password reset email to {}", recipientEmail);
                return true;
            }
        } catch (Exception e) {
            log.warn("Could not dispatch SMTP email directly to {}: {}. Logging reset link for local fallback.", recipientEmail, e.getMessage());
        }

        // Fallback console log for local dev / unconfigured SMTP
        log.info("\n========================================================" +
                 "\n[DEMO/DEV EMAIL DISPATCH LOG]" +
                 "\nTo: " + recipientEmail +
                 "\nSubject: " + subject +
                 "\nReset Link: " + resetLink +
                 "\n========================================================");
        return true;
    }
}
