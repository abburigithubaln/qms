package com.qms.queue.service.ServiceImpl;

import com.qms.queue.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String fromName;

    public EmailServiceImpl(
            JavaMailSender mailSender,
            @Value("${app.mail.from}") String fromAddress,
            @Value("${app.mail.from-name}") String fromName) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.fromName = fromName;
    }

    @Override
    @Async("emailTaskExecutor")
    public void sendEmail(String to, String subject, String body) {
        if (to == null || to.isBlank()) {
            log.warn("Skipping email — recipient address is blank");
            return;
        }
        try {
            log.info("Sending email → to: '{}', subject: '{}'", to, subject);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(fromAddress, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
            log.info("Email sent successfully to: '{}'", to);

        } catch (Exception e) {
            log.error("SMTP error sending email to '{}' [subject: {}]: {}", to, subject, e.getMessage(), e);
        }
    }
}
