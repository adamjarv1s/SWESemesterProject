CREATE DATABASE IF NOT EXISTS uterusdata;
USE uterusdata;
create table IF NOT EXISTS UserInfo(
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       Name VARCHAR(100) NOT NULL,
                                       Pet VARCHAR(100) NOT NULL,
                                       Type INT NOT NULL,
                                       Streak INT NOT NULL
);
create table IF NOT EXISTS periodData(
                                         id INT AUTO_INCREMENT PRIMARY KEY,
                                         CurrentDate DATE NOT NULL,
                                         StartDate DATE NOT NULL,
                                         CurrentLength int NOT NULL,
                                         Heaviness int not null,
                                         LastDay bool
);
create table if not exists purchaseData(
                                           id INT AUTO_INCREMENT PRIMARY KEY,
                                           currentDiamonds int not null,
                                           purchasedItem float
);
create table if not exists userLoginData
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username varchar(100) not null,
    password varchar(100) not null
)