-- Schéma de la base de données hospitalière
-- Commande : psql -U postgres -d hospital_db -f backend/sql/schema.sql

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
  role_type VARCHAR(20) NOT NULL CHECK (role_type IN ('PATIENT', 'AGENT', 'MEDECIN', 'ADMIN')),
  matricule VARCHAR(20),
  specialite VARCHAR(50),
  num_secu VARCHAR(15),
  actif BOOLEAN NOT NULL DEFAULT TRUE,
  cree_le TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE t_rendez_vous (
  id_rdv SERIAL PRIMARY KEY,
  date_heure TIMESTAMP NOT NULL,
  motif VARCHAR(255),
  statut VARCHAR(20) NOT NULL DEFAULT 'PLANIFIE' CHECK (statut IN ('PLANIFIE', 'PRESENT', 'ANNULE')),
  id_patient INT NOT NULL REFERENCES t_utilisateur(id_utilisateur),
  id_medecin INT NOT NULL REFERENCES t_utilisateur(id_utilisateur),
  rappel_envoye BOOLEAN DEFAULT FALSE
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
  numero_box VARCHAR(10),
  id_urgence INT
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

CREATE TABLE t_journal_activite (
  id_journal SERIAL PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  id_utilisateur INT REFERENCES t_utilisateur(id_utilisateur),
  date_action TIMESTAMP NOT NULL DEFAULT NOW()
);
