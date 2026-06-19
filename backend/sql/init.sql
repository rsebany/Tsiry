-- Initialisation du schéma hospitalier (LDM équipe)
-- Commande : psql -U postgres -d hospital_db -f backend/sql/init.sql
-- Ou : cd backend && npm run db:init

DROP TABLE IF EXISTS t_cas_urgence CASCADE;
DROP TABLE IF EXISTS t_hopital CASCADE;
DROP TABLE IF EXISTS t_ticket CASCADE;
DROP TABLE IF EXISTS t_file_attente CASCADE;
DROP TABLE IF EXISTS t_rendez_vous CASCADE;
DROP TABLE IF EXISTS t_utilisateur CASCADE;

CREATE TABLE t_utilisateur (
  id_utilisateur SERIAL PRIMARY KEY,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL,
  telephone VARCHAR(20),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_type VARCHAR(20) NOT NULL,
  matricule VARCHAR(20),
  specialite VARCHAR(50),
  num_secu VARCHAR(15)
);

CREATE TABLE t_rendez_vous (
  id_rdv SERIAL PRIMARY KEY,
  date_heure TIMESTAMP NOT NULL,
  motif VARCHAR(255),
  statut VARCHAR(20) NOT NULL DEFAULT 'PLANIFIE',
  id_patient INT NOT NULL REFERENCES t_utilisateur(id_utilisateur),
  id_medecin INT NOT NULL REFERENCES t_utilisateur(id_utilisateur)
);

CREATE TABLE t_file_attente (
  id_file SERIAL PRIMARY KEY,
  date_du_jour DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE t_ticket (
  id_ticket SERIAL PRIMARY KEY,
  numero INT NOT NULL,
  id_file INT NOT NULL REFERENCES t_file_attente(id_file),
  id_patient INT REFERENCES t_utilisateur(id_utilisateur),
  statut VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
  heure_creation TIMESTAMP NOT NULL DEFAULT NOW(),
  heure_appel TIMESTAMP,
  heure_cloture TIMESTAMP,
  patient_nom VARCHAR(50),
  patient_prenom VARCHAR(50),
  numero_box VARCHAR(10)
);

CREATE TABLE t_cas_urgence (
  id_urgence SERIAL PRIMARY KEY,
  id_patient INT NOT NULL REFERENCES t_utilisateur(id_utilisateur),
  id_medecin INT REFERENCES t_utilisateur(id_utilisateur),
  pouls INT NOT NULL,
  tension_systolique INT NOT NULL,
  saturation_o2 INT NOT NULL,
  niveau_priorite VARCHAR(20) NOT NULL,
  score_gravite INT NOT NULL,
  date_declaration TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE t_hopital (
  id_hopital SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  type VARCHAR(50)
);

-- Données de test — utilisateurs (mot de passe demo : demo123)
-- Hash bcrypt : $2b$10$4NNs3WDwZ/KeEDe84XlpJO4JFK3Ix7sTVc1me54o/4SGVkM2tAinG
INSERT INTO t_utilisateur (nom, prenom, telephone, email, password_hash, role_type, num_secu) VALUES
  ('Dupont', 'Marie', '0612345678', 'marie.dupont@demo.fr', '$2b$10$4NNs3WDwZ/KeEDe84XlpJO4JFK3Ix7sTVc1me54o/4SGVkM2tAinG', 'PATIENT', '123456789012345');

INSERT INTO t_utilisateur (nom, prenom, telephone, email, password_hash, role_type, matricule, specialite) VALUES
  ('Martin', 'Jean', '0623456789', 'jean.martin@demo.fr', '$2b$10$4NNs3WDwZ/KeEDe84XlpJO4JFK3Ix7sTVc1me54o/4SGVkM2tAinG', 'MEDECIN', 'MED001', 'Cardiologie'),
  ('Bernard', 'Sophie', '0634567890', 'sophie.bernard@demo.fr', '$2b$10$4NNs3WDwZ/KeEDe84XlpJO4JFK3Ix7sTVc1me54o/4SGVkM2tAinG', 'MEDECIN', 'MED002', 'Pédiatrie'),
  ('Petit', 'Luc', '0645678901', 'luc.petit@demo.fr', '$2b$10$4NNs3WDwZ/KeEDe84XlpJO4JFK3Ix7sTVc1me54o/4SGVkM2tAinG', 'MEDECIN', 'MED003', 'Dermatologie'),
  ('Robert', 'Claire', '0656789012', 'claire.robert@demo.fr', '$2b$10$4NNs3WDwZ/KeEDe84XlpJO4JFK3Ix7sTVc1me54o/4SGVkM2tAinG', 'MEDECIN', 'MED004', 'Cardiologie');

INSERT INTO t_utilisateur (nom, prenom, telephone, email, password_hash, role_type) VALUES
  ('Rakoto', 'Agent', '0667890123', 'agent.accueil@demo.fr', '$2b$10$4NNs3WDwZ/KeEDe84XlpJO4JFK3Ix7sTVc1me54o/4SGVkM2tAinG', 'AGENT');

-- Données de test — rendez-vous (UC1 / UC2 demo patient id 1)
INSERT INTO t_rendez_vous (date_heure, motif, statut, id_patient, id_medecin) VALUES
  ('2026-06-20 10:00:00', 'Consultation de contrôle', 'PLANIFIE', 1, 2),
  ('2026-06-15 14:30:00', 'Suivi cardiologie', 'PLANIFIE', 1, 2),
  (NOW() + INTERVAL '15 minutes', 'Consultation kiosk demo (aujourd''hui)', 'PLANIFIE', 1, 2);

-- Données de test — file d'attente et tickets (UC4 / UC5 / UC6)
INSERT INTO t_file_attente (date_du_jour) VALUES (CURRENT_DATE);

INSERT INTO t_ticket (numero, id_file, statut, patient_nom, patient_prenom, id_patient) VALUES
  (1, 1, 'EN_ATTENTE', 'Rakoto', 'Jean', NULL),
  (2, 1, 'EN_ATTENTE', 'Rabe', 'Marie', NULL),
  (3, 1, 'APPELE', 'Andria', 'Paul', NULL);

-- Données de test — hôpitaux (UC11 cartographie)
INSERT INTO t_hopital (nom, latitude, longitude, type) VALUES
  ('CHU Joseph Raseta Befelatanana', -18.8792000, 47.5079000, 'CHU'),
  ('Hôpital Militaire d''Antananarivo', -18.9136000, 47.5361000, 'Militaire'),
  ('Centre Hospitalier Soavinandriana', -18.9200000, 47.5480000, 'Public'),
  ('Clinique Ilafy', -18.8985000, 47.5210000, 'Privé');
