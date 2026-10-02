package com.example.pfa.services;

import com.example.pfa.entities.CompteEtudiantResponsable;
import com.example.pfa.entities.CompteResponsable;
import com.example.pfa.repositories.CompteResponsableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class CompteResponsableService {

     @Autowired
     private CompteResponsableRepository compteResponsableRepository;

     @Autowired
     private PasswordEncoder passwordEncoder;

    // Enregistrer un compte responsable (étudiant ou professeur)
    public CompteResponsable register(CompteResponsable responsable) {
        responsable.setPassword(passwordEncoder.encode(responsable.getPassword()));
        return compteResponsableRepository.save(responsable);
    }

    public CompteResponsable authenticate(String email, String password) {
        CompteResponsable responsable = compteResponsableRepository.findByEmail(email);
        if (responsable != null) {
            if (passwordEncoder.matches(password, responsable.getPassword())) {
                return responsable;
            }
        }
        return null; // échec d'authentification
    }





    // Trouver un responsable par son ID
    public Optional<CompteResponsable> findById(Long id) {
        return compteResponsableRepository.findById(id);
    }

    // Trouver un responsable par son email
    public Optional<CompteResponsable> findByPasswordAndEmail(String email, String password) {
        return compteResponsableRepository.findByPasswordAndEmail(email,password);
    }

    // Mettre à jour les informations du responsable
    public CompteResponsable updateCompteResponsable(Long id, CompteResponsable updatedCompteResponsable) {
        Optional<CompteResponsable> existingCompte = compteResponsableRepository.findById(id);

        if (existingCompte.isPresent()) {
            CompteResponsable compte = existingCompte.get();
            compte.setNom_responsable(updatedCompteResponsable.getNom_responsable());
            compte.setPrenom_responsable(updatedCompteResponsable.getPrenom_responsable());
            compte.setEmail(updatedCompteResponsable.getEmail());
            compte.setPassword(updatedCompteResponsable.getPassword());

            // Pour CompteEtudiantResponsable, mettre à jour la filière
            if (compte instanceof CompteEtudiantResponsable) {
                ((CompteEtudiantResponsable) compte).setFilière(((CompteEtudiantResponsable) updatedCompteResponsable).getFilière());
            }

            return compteResponsableRepository.save(compte);
        } else {
            throw new RuntimeException("Compte Responsable non trouvé");
        }
    }

    // Supprimer un responsable
    public void deleteCompteResponsable(Long id) {
        Optional<CompteResponsable> compte = compteResponsableRepository.findById(id);

        if (compte.isPresent()) {
            compteResponsableRepository.delete(compte.get());
        } else {
            throw new RuntimeException("Compte Responsable non trouvé");
        }
    }



    // ----------------------------- Concernant mot de passe oublier --------------------------

    @Autowired
    private JavaMailSender mailSender;



    // Vérifier si l'email existe
    public boolean emailExists(String email) {
        return compteResponsableRepository.findByEmail(email) != null;
    }

    // Générer un token de réinitialisation et envoyer un email
    public boolean sendPasswordResetEmail(String email) {
        CompteResponsable responsable = compteResponsableRepository.findByEmail(email);
        if (responsable == null) {
            return false;
        }

        // Générer un token unique avec une expiration
        String token = UUID.randomUUID().toString();
        responsable.setResetToken(token);
        responsable.setResetTokenExpiry(new Date(System.currentTimeMillis() + 3600000)); // Expire dans 1 heure
        compteResponsableRepository.save(responsable);

        // Remplacer cette URL par l'URL de votre application Angular locale
        String resetUrl = "http://localhost:4200/reset-password?token=" + token;

        // Envoyer l'email
        // Envoyer l'email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("sportensaj@gmail.com");
            message.setTo(email);
            message.setSubject("Réinitialisation de mot de passe - SPORT&ENSAJ");
            message.setText("Bonjour " + responsable.getPrenom_responsable() + ",\n\n" +
                    "Vous avez demandé la réinitialisation de votre mot de passe. " +
                    "Veuillez cliquer sur le lien suivant pour définir un nouveau mot de passe:\n\n" +
                    resetUrl + "\n\n" +
                    "Ce lien expirera dans 1 heure.\n\n" +
                    "Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer ce message.\n\n" +
                    "Cordialement,\n" +
                    "L'équipe SPORT&ENSAJ");
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Valider le token et réinitialiser le mot de passe
    public boolean resetPassword(String token, String newPassword) {
        CompteResponsable responsable = compteResponsableRepository.findByResetToken(token) ;

        if (responsable == null || responsable.getResetTokenExpiry().before(new Date())) {
            return false;
        }

        // Mettre à jour le mot de passe
        responsable.setPassword(newPassword); // Assurez-vous de hasher le mot de passe si nécessaire
        responsable.setResetToken(null);
        responsable.setResetTokenExpiry(null);
        compteResponsableRepository.save(responsable);

        return true;
    }





    /**
     * Récupérer un responsable par son email (utilisé comme username)
     */
    public CompteResponsable getResponsableByUsername(String email) {
        return compteResponsableRepository.findByemail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec email: " + email));
    }


    public CompteResponsable findByToken(String resetToken) {
        return compteResponsableRepository.findByResetToken(resetToken);
    }

    // Dans CompteResponsableService
    public CompteResponsable save(CompteResponsable responsable) {
        return compteResponsableRepository.save(responsable);
    }



    /**
     * Trouve un compte responsable par son token de réinitialisation
     * @param token Le token de réinitialisation
     * @return Le compte responsable correspondant au token
     */
    public Optional<CompteResponsable> findByResetToken(String token) {
        CompteResponsable compte = compteResponsableRepository.findByResetToken(token);
        return Optional.ofNullable(compte); // transforme un CompteResponsable en Optional
    }

}




