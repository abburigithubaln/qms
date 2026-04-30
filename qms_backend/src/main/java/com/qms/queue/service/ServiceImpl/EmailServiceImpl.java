package com.qms.queue.service.ServiceImpl;

import com.qms.queue.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Value("${BREVO_API_KEY}")
    private String apiKey;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.mail.from-name}")
    private String fromName;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    @Override
    @Async("emailTaskExecutor")
    public void sendEmail(String to, String subject, String body) {
        if (to == null || to.isBlank()) {
            log.warn("Skipping email — recipient address is blank");
            return;
        }
        try {
            log.info("Sending email via Brevo API → to: '{}', subject: '{}'", to, subject);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            // Escape the HTML body for safe JSON embedding
            String escapedBody = body
                    .replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "");

            String escapedSubject = subject
                    .replace("\\", "\\\\")
                    .replace("\"", "\\\"");

            String payload = String.format(
                    "{\"sender\":{\"name\":\"%s\",\"email\":\"%s\"}," +
                    "\"to\":[{\"email\":\"%s\"}]," +
                    "\"subject\":\"%s\"," +
                    "\"htmlContent\":\"%s\"}",
                    fromName, fromAddress, to, escapedSubject, escapedBody
            );

            HttpEntity<String> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(BREVO_API_URL, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Email sent successfully via Brevo API to: '{}'", to);
            } else {
                log.error("Brevo API returned non-2xx status: {} for recipient: '{}'", response.getStatusCode(), to);
            }

        } catch (Exception e) {
            log.error("Brevo API error sending email to '{}' [subject: {}]: {}", to, subject, e.getMessage(), e);
        }
    }
}
