package com.example.pfa.entities;
import jakarta.persistence.*;


import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonSubTypes;

import javax.validation.constraints.NotBlank;
import java.util.Date;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CompteEtudiantResponsable.class, name = "etudiant"),
        @JsonSubTypes.Type(value = CompteProfesseurResponsable.class, name = "professeur")
})

@Entity
@Inheritance(strategy = InheritanceType.JOINED) // Stratégie pour héritage
public class CompteResponsable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Nom est obligatoire")
    private String nom_responsable;
    @NotBlank(message = "Prenom Du Responsable est obligatoire")
    private String prenom_responsable;
    @NotBlank(message = "Email est obligatoire")
    private String email;
    @NotBlank(message = "Password est obligatoire")
    private String password;

    public CompteResponsable() {
    }

    public CompteResponsable(String nom_responsable, String prenom_responsable, String email, String password) {
        this.nom_responsable = nom_responsable;
        this.prenom_responsable = prenom_responsable;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotBlank(message = "Nom est obligatoire") String getNom_responsable() {
        return nom_responsable;
    }

    public void setNom_responsable(@NotBlank(message = "Nom est obligatoire") String nom_responsable) {
        this.nom_responsable = nom_responsable;
    }

    public @NotBlank(message = "Prenom Du Responsable est obligatoire") String getPrenom_responsable() {
        return prenom_responsable;
    }

    public void setPrenom_responsable(@NotBlank(message = "Prenom Du Responsable est obligatoire") String prenom_responsable) {
        this.prenom_responsable = prenom_responsable;
    }

    public @NotBlank(message = "Email est obligatoire") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "Email est obligatoire") String email) {
        this.email = email;
    }

    public @NotBlank(message = "Password est obligatoire") String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "Password est obligatoire") String password) {
        this.password = password;
    }


    ///--------------------Concernent password oublier -------------

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry")
    @Temporal(TemporalType.TIMESTAMP)
    private Date resetTokenExpiry;

    // Getters et setters
    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public Date getResetTokenExpiry() {
        return resetTokenExpiry;
    }

    public void setResetTokenExpiry(Date resetTokenExpiry) {
        this.resetTokenExpiry = resetTokenExpiry;
    }



}
