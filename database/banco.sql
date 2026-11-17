CREATE DATABASE IF NOT EXISTS controle_embalagens
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE controle_embalagens;

CREATE TABLE IF NOT EXISTS embalagem (
  id_embalagem INT UNSIGNED NOT NULL AUTO_INCREMENT,
  descricao VARCHAR(255) NOT NULL,
  material VARCHAR(100) NOT NULL,
  capacidade DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (id_embalagem)
);

CREATE TABLE IF NOT EXISTS maquina (
  id_maquina INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  patrimonio VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_maquina)
);

CREATE TABLE IF NOT EXISTS operador (
  id_operador INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  matricula VARCHAR(100) NOT NULL,
  turno VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_operador)
);

