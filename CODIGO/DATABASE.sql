-- Criação do banco de dados
CREATE DATABASE Registro;
GO

-- Seleção do banco de dados
USE Registro;
GO

-- Criação da tabela
CREATE TABLE Clientes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(40) NOT NULL,
    Senha NVARCHAR(MAX) NOT NULL
);
GO
