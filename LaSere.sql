-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : ven. 06 fév. 2026 à 11:43
-- Version du serveur : 10.5.23-MariaDB-0+deb11u1
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `LaSerre`
--

-- --------------------------------------------------------

--
-- Structure de la table `Actionneur`
--

CREATE TABLE `Actionneur` (
  `id` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `etat` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `BadgeRFID`
--

CREATE TABLE `BadgeRFID` (
  `id` int(11) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `utilisateur_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Consigne`
--

CREATE TABLE `Consigne` (
  `id` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `valeur` float DEFAULT NULL,
  `utilisateur_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `LectureDuCapteur`
--

CREATE TABLE `LectureDuCapteur` (
  `id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `valeur` float NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Log`
--

CREATE TABLE `Log` (
  `id` int(11) NOT NULL,
  `action` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`action`)),
  `date` datetime DEFAULT NULL,
  `utilisateur_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Utilisateur`
--

CREATE TABLE `Utilisateur` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) NOT NULL,
  `mail` varchar(50) DEFAULT NULL,
  `login` varchar(50) DEFAULT NULL,
  `mdp` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Utilisateur`
--

INSERT INTO `Utilisateur` (`id`, `nom`, `prenom`, `mail`, `login`, `mdp`) VALUES
(1, 'Bruchet', 'Raphael', 'raphael.bruchet80800@gmail.com', 'rafox', '$2b$10$K5XhkUdLmcr1xGDkV1UWwO4Xj7X8waF9VqPSoGkJazzmL.HVyT9y6'),
(3, 'aa', 'aa', 'aa', 'aa', '$2b$10$w28LlqhB3ZKet1VXIEpMoOqIh2uGEQUiKZ5RqdCH4hd.rlClCQYda');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Actionneur`
--
ALTER TABLE `Actionneur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `BadgeRFID`
--
ALTER TABLE `BadgeRFID`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `utilisateur_id` (`utilisateur_id`);

--
-- Index pour la table `Consigne`
--
ALTER TABLE `Consigne`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilisateur_id` (`utilisateur_id`);

--
-- Index pour la table `LectureDuCapteur`
--
ALTER TABLE `LectureDuCapteur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Log`
--
ALTER TABLE `Log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilisateur_id` (`utilisateur_id`);

--
-- Index pour la table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Actionneur`
--
ALTER TABLE `Actionneur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `BadgeRFID`
--
ALTER TABLE `BadgeRFID`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Consigne`
--
ALTER TABLE `Consigne`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `LectureDuCapteur`
--
ALTER TABLE `LectureDuCapteur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Log`
--
ALTER TABLE `Log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `BadgeRFID`
--
ALTER TABLE `BadgeRFID`
  ADD CONSTRAINT `BadgeRFID_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `Utilisateur` (`id`);

--
-- Contraintes pour la table `Consigne`
--
ALTER TABLE `Consigne`
  ADD CONSTRAINT `Consigne_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `Utilisateur` (`id`);

--
-- Contraintes pour la table `Log`
--
ALTER TABLE `Log`
  ADD CONSTRAINT `Log_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `Utilisateur` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
