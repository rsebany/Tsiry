-- Initialisation du schéma hospitalier (LDM équipe)
-- Commande : psql -U postgres -d hospital_db -f backend/sql/init.sql

DROP TABLE IF EXISTS t_rendez_vous CASCADE;
DROP TABLE IF EXISTS t_utilisateur CASCADE;

CREATE TABLE t_utilisateur (
  id_utilisateur SERIAL PRIMARY KEY,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL,
  telephone VARCHAR(20),
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

-- Données de test
INSERT INTO t_utilisateur (nom, prenom, telephone, role_type, num_secu) VALUES
  ('Dupont', 'Marie', '0612345678', 'PATIENT', '123456789012345');

INSERT INTO t_utilisateur (nom, prenom, telephone, role_type, matricule, specialite) VALUES
  ('Martin', 'Jean', '0623456789', 'MEDECIN', 'MED001', 'Cardiologie'),
  ('Bernard', 'Sophie', '0634567890', 'MEDECIN', 'MED002', 'Pédiatrie'),
  ('Petit', 'Luc', '0645678901', 'MEDECIN', 'MED003', 'Dermatologie'),
  ('Robert', 'Claire', '0656789012', 'MEDECIN', 'MED004', 'Cardiologie');
