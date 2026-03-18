drop schema IF EXISTS  uterusdata;
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
                                         LastDay bool,
                                         FOREIGN KEY (id) REFERENCES UserInfo(id)
);
create table if not exists purchaseData(
                                           id INT AUTO_INCREMENT PRIMARY KEY,
                                           currentDiamonds int not null,
                                           purchasedItem float,
                                           FOREIGN KEY (id) REFERENCES UserInfo(id)
);