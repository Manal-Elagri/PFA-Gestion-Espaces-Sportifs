package com.example.pfa.services;

import com.example.pfa.entities.*;
import com.example.pfa.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private CompétitionRepository competitionRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private ClubCompetitionRepository clubCompetitionRepository;

    @Autowired
    private ReservationTerrainRepository reservationTerrainRepository;

    @Autowired
    private ResultatMatchsRepository resultatMatchRepository;

    @Autowired
    private TerrainRepository terrainRepository;

    @Autowired
    private EquipeRepository equipeRepository;


    @Autowired
    private  TableScoreRepository tableScoreRepository;

    @Autowired
    private CompteResponsableService compteResponsableService; // Assurez-vous que le service de gestion des comptes est bien injecté.

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private EmailService emailService;

    public Admin register(Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }

    public Admin authenticate(String email, String password) {
        Optional<Admin> optionalAdmin = adminRepository.findByEmail(email);
        if (optionalAdmin.isPresent()) {
            Admin admin = optionalAdmin.get();
            if (passwordEncoder.matches(password, admin.getPassword())) {
                return admin;
            }
        }
        return null; // échec d'authentification
    }


    //************************************** Gestion des compétitions *******************************


    public Competition createCompetition(Competition competition) {
        return competitionRepository.save(competition);
    }

    public Competition updateCompetition(Long id, Competition competitionDetails) {
        Optional<Competition> competition = competitionRepository.findById(id);
        if (competition.isPresent()) {
            Competition existingCompetition = competition.get();
            existingCompetition.setNom(competitionDetails.getNom());
            existingCompetition.setDescription(competitionDetails.getDescription());
            existingCompetition.setDateDebut(competitionDetails.getDateDebut());
            existingCompetition.setDateFin(competitionDetails.getDateFin());
            existingCompetition.setEtatCompetition(competitionDetails.getEtatCompetition());
            existingCompetition.setCategorieCompetition(competitionDetails.getCategorieCompetition());
            existingCompetition.setTypedesport(competitionDetails.getTypedesport());
            existingCompetition.setImageURL(competitionDetails.getImageURL());
            return competitionRepository.save(existingCompetition);
        }
        return null;
    }

    public boolean deleteCompetition(Long id) {
        Optional<Competition> competition = competitionRepository.findById(id);
        if (competition.isPresent()) {
            competitionRepository.delete(competition.get());
            return true;
        }
        return false;
    }

    public List<Competition> getAllCompetitions() {
        return competitionRepository.findAll();
    }

    public List<Competition> getCompetitionsAVenir() {
        return competitionRepository.findByEtatCompetition(StatutCompetition.À_venir);
    }

    // ******************************* Gestion des réservations *********************************



    // Liste des réservations en attente
    public List<ReservationTerrain> getReservationsEnAttente() {
        return reservationTerrainRepository.findReservationsEnAttente();
    }

    // Liste des réservations validées
    public List<ReservationTerrain> getReservationsValidees() {
        return reservationTerrainRepository.findReservationsValidees();
    }

    // Méthode facultative : pour afficher toutes les réservations
    public List<ReservationTerrain> getAllReservations() {
        return reservationTerrainRepository.findAll();
    }

    //Notifications pour les reservations non livrées depuis un certain temps
    public List<ReservationTerrain> getReservationsEnAttenteDepuis(Long heures) {
        LocalDateTime limite = LocalDateTime.now().minusHours(heures);
        return reservationTerrainRepository.findReservationsEnAttenteDepuis(limite);
    }


    //Statistique des reservations en temps réel
    public Map<String, Object> getTableauDeBord() {
        Map<String, Object> stats = new HashMap<>();

        // Statistiques des réservations
        stats.put("totalReservations", reservationTerrainRepository.countAllReservations());
        stats.put("reservationsEnAttente", reservationTerrainRepository.countReservationsEnAttente());
        stats.put("reservationsValidees", reservationTerrainRepository.countReservationsValidees());
        stats.put("reservationsParTerrain", getReservationsParTerrain());
        return stats;
    }

    // Méthode pour obtenir le nombre de réservations par terrain
    private Map<Long, Long> getReservationsParTerrain() {
        Map<Long, Long> reservationsParTerrain = new HashMap<>();
        List<Terrain> terrains = terrainRepository.findAll(); // Remplace cela par la manière dont tu récupères tes terrains

        for (Terrain terrain : terrains) {
            Long terrainId = terrain.getId();
            Long count = reservationTerrainRepository.countReservationsByTerrain(terrainId);
            reservationsParTerrain.put(terrainId, count);
        }

        return reservationsParTerrain;
    }


    // Changer l'état de la réservation avec notification
    public void changeEtatReservation(ReservationTerrain reservationTerrain, EtatReservationTerrain newStatus) {
        reservationTerrain.setEtatReservation(newStatus);
        reservationTerrainRepository.save(reservationTerrain);

        // Récupérer les informations pour l'email
        String userEmail = reservationTerrain.getEquipe().getResponsable().getEmail(); // Ajustez selon votre modèle
       // String equipeName = reservationTerrain.getEquipe().getNom_equipe();
        String terrainName = reservationTerrain.getTerrain().getNom();

        // Envoyer la notification par email
        emailService.sendReservationStatusNotification(userEmail, terrainName, newStatus);
    }


    public Optional<ReservationTerrain> getReservationParId(Long id) {
        return reservationTerrainRepository.findById(id);
    }


    public List<ReservationTerrain> getReservationParEquipe(Long equipeId) {
        return reservationTerrainRepository.findByEquipeId(equipeId);
    }

    //***************************  Gestion des équipes avec (CompteResponsable) ***************************


    // Récupérer toutes les équipes d'un responsable (étudiant ou professeur)
    public List<Equipe> getAllEquipesByResponsable(Long responsableId) {
        // Trouver le responsable
        Optional<CompteResponsable> responsableOpt = compteResponsableService.findById(responsableId);
        if (responsableOpt.isPresent()) {
            CompteResponsable responsable = responsableOpt.get();
            // Récupérer toutes les équipes associées à ce responsable
            return equipeRepository.findByResponsable(responsable);
        } else {
            throw new RuntimeException("Responsable non trouvé");
        }
    }

    public List<Equipe> getAllEquipes() {
        return equipeRepository.findAll();
    }


    // *******************************************      Gestion des clubs     **************************

         // Méthode pour récupérer tous les clubs
        public List<Club> getAllClubs() {
        return clubRepository.findAll();
         }



    public List<Club> getAllClubsByResponsable(Long responsableId) {
        // Trouver le responsable
        Optional<CompteResponsable> responsableOpt = compteResponsableService.findById(responsableId);
        if (responsableOpt.isPresent()) {
            CompteResponsable responsable = responsableOpt.get();
            // Récupérer toutes les équipes associées à ce responsable
            return clubRepository.findByResponsable(responsable);
        } else {
            throw new RuntimeException("Responsable non trouvé");
        }
    }
    //  *******************************    Gestion de la participation des clubs à des compétitions   ********************************

    // Méthode pour obtenir les participations d'un club
    public List<ClubCompetition> getParticipationsParClub(Long clubId) {
        return clubCompetitionRepository.findByClubId(clubId);
    }

    // Méthode pour obtenir les participations à une compétition
    public List<ClubCompetition> getParticipationsParCompetition(Long competitionId) {
        return clubCompetitionRepository.findByCompetitionId(competitionId);
    }

    // Méthode pour obtenir les statistiques des participations
    public Map<String, Object> getTableauDeBordParticipations() {
        Map<String, Object> stats = new HashMap<>();

        // Statistiques des participations
        stats.put("totalParticipations", clubCompetitionRepository.count());
        stats.put("participationsEnCours", clubCompetitionRepository.findByStatutParticipation(StatutParticipation.INSCRIT).size());
        stats.put("participationsTerminees", clubCompetitionRepository.findByStatutParticipation(StatutParticipation.VALIDE).size());
        stats.put("participationsAnnulees", clubCompetitionRepository.findByStatutParticipation(StatutParticipation.ELIMINE).size());

        return stats;
    }


    // Modifier le statut de la participation avec notification
    public void changeParticipationStatus(ClubCompetition clubCompetition, StatutParticipation newStatus) {
        clubCompetition.setStatutParticipation(newStatus);
        clubCompetitionRepository.save(clubCompetition);

        // Récupérer les informations pour l'email
        String userEmail = clubCompetition.getClub().getResponsable().getEmail(); // Ajustez selon votre modèle
        String clubName = clubCompetition.getClub().getNom();
        String competitionName = clubCompetition.getCompetition().getNom();

        // Envoyer la notification par email
        emailService.sendParticipationStatusNotification(userEmail, clubName, competitionName, newStatus);
    }


    public Optional<ClubCompetition> getParticipationById(Long id) {
        return clubCompetitionRepository.findById(id);
    }


    // *******************************************  Gestion des terrains **********************************
    public Terrain createTerrain(Terrain terrain) {
        return terrainRepository.save(terrain);
    }

    public Terrain updateTerrain(Long id, Terrain terrainDetails) {
        Optional<Terrain> terrain = terrainRepository.findById(id);
        if (terrain.isPresent()) {
            Terrain existingTerrain = terrain.get();
            existingTerrain.setNom(terrainDetails.getNom());
            existingTerrain.setMesure(terrainDetails.getMesure());
            existingTerrain.setImageURL(terrainDetails.getImageURL());
            existingTerrain.setEstDisponible(terrainDetails.isEstDisponible());
            return terrainRepository.save(existingTerrain);
        }
        return null;
    }

    public boolean deleteTerrain(Long id) {
        Optional<Terrain> terrain = terrainRepository.findById(id);
        if (terrain.isPresent()) {
            terrainRepository.delete(terrain.get());
            return true;
        }
        return false;
    }

    public List<Terrain> getAllTerrain() {
        return terrainRepository.findAll();
    }

    //  *********************************    Gestion des résultats de matchs    *******************************
    public ResultatMatchs createResultatMatch(ResultatMatchs resultatMatch) {
        return resultatMatchRepository.save(resultatMatch);
    }

    public ResultatMatchs updateResultatMatch(Long id, ResultatMatchs resultatMatchDetails) {
        Optional<ResultatMatchs> resultatMatch = resultatMatchRepository.findById(id);
        if (resultatMatch.isPresent()) {
            ResultatMatchs existingResultat = resultatMatch.get();
            existingResultat.setScoreEquipeA(resultatMatchDetails.getScoreEquipeA());
            existingResultat.setScoreEquipeB(resultatMatchDetails.getScoreEquipeB());
            existingResultat.setDateMatch(resultatMatchDetails.getDateMatch());
            existingResultat.setStatutMatch(resultatMatchDetails.getStatutMatch());
            existingResultat.setCommentaires(resultatMatchDetails.getCommentaires());
            return resultatMatchRepository.save(existingResultat);
        }
        return null;
    }

    public boolean deleteResultatMatch(Long id) {
        Optional<ResultatMatchs> resultatMatch = resultatMatchRepository.findById(id);
        if (resultatMatch.isPresent()) {
            resultatMatchRepository.delete(resultatMatch.get());
            return true;
        }
        return false;
    }



    //***************************  Gestion du table de score **************************

    // Créer une nouvelle table de score pour un club
    public TableScore createTableScore(TableScore tableScore) {
        return tableScoreRepository.save(tableScore);
    }

    // Modifier une table de score existante
    public TableScore updateTableScore(Long id, TableScore tableScoreDetails) {
        TableScore tableScore = tableScoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table de score non trouvée avec l'ID " + id));

        tableScore.setMatchsJoues(tableScoreDetails.getMatchsJoues());
        tableScore.setMatchsGagnes(tableScoreDetails.getMatchsGagnes());
        tableScore.setMatchsPerdus(tableScoreDetails.getMatchsPerdus());
        tableScore.setMatchsNuls(tableScoreDetails.getMatchsNuls());
        tableScore.setPoints(tableScoreDetails.getPoints());

        return tableScoreRepository.save(tableScore);
    }

    // Supprimer une table de score
    public void deleteTableScore(Long id) {
        TableScore tableScore = tableScoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table de score non trouvée avec l'ID " + id));
        tableScoreRepository.delete(tableScore);
    }

    // Méthode pour récupérer la table de score pour un club spécifique
    public TableScore getTableScoreForClub(Long clubId) {
        return tableScoreRepository.findByClubsId(clubId);
    }

    // Récupérer toutes les tables de score
    public List<TableScore> getAllTablesScores() {
        return tableScoreRepository.findAll();
    }




}
