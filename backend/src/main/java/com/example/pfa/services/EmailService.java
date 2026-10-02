package com.example.pfa.services;

import com.example.pfa.entities.EtatReservationTerrain;
import com.example.pfa.entities.StatutParticipation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String email, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("sportensaj@gmail.com");
        message.setTo(email);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    public void sendReservationStatusNotification(String email,String terrainName, EtatReservationTerrain newStatus ) {
        String subject = "Mise à jour de l'état de votre réservation de terrain";
        String message = String.format(
                "Bonjour,\n\n" +
                        "Nous vous informons que l'état de votre réservation pour le terrain %s a été modifié à : %s.\n\n" +
                        "Si vous avez des questions, n'hésitez pas à nous contacter.\n\n" +
                        "Cordialement,\n" +
                        "L'équipe SPORTENSAJ",

                terrainName,
                newStatus.toString()
        );

        sendSimpleMessage(email, subject, message);
    }

    public void sendParticipationStatusNotification(String email, String clubName, String competitionName, StatutParticipation newStatus) {
        String subject = "Mise à jour du statut de participation";
        String message = String.format(
                "Bonjour,\n\n" +
                        "Nous vous informons que le statut de participation du club %s à la compétition %s a été modifié à : %s.\n\n" +
                        "Si vous avez des questions, n'hésitez pas à nous contacter.\n\n" +
                        "Cordialement,\n" +
                        "L'équipe SPORTENSAJ",
                clubName,
                competitionName,
                newStatus.toString()
        );

        sendSimpleMessage(email, subject, message);
    }
}