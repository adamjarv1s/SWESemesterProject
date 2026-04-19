drop database uterusdata;
CREATE DATABASE IF NOT EXISTS uterusdata;
USE uterusdata;
create table IF NOT EXISTS UserInfo(
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       Name VARCHAR(100) NOT NULL,
                                       Pet VARCHAR(100) NOT NULL,
                                       Pet_id int not null,
                                       accountType INT NOT NULL,
                                       Streak INT NOT NULL,
                                       lastActiveDay date NOT NULL,
                                       activeUser bool not null,
                                       averagePeriodLength int not null
);
create table IF NOT EXISTS periodData(
                                         id INT NOT NULL,
                                         PeriodID INT AUTO_INCREMENT,
                                         PRIMARY KEY (PeriodID),
                                         CurrentDate DATE NOT NULL,
                                         StartDate DATE NOT NULL,
                                         CurrentLength int NOT NULL,
                                         Heaviness int not null,
                                         LastDay bool not null,
                                         description VARCHAR(100),
                                         FOREIGN KEY (id) REFERENCES UserInfo(id),
                                         UNIQUE KEY unique_user_date (id, currentDate)
);
create table if not exists purchaseData(
                                           id INT AUTO_INCREMENT PRIMARY KEY,
                                           currentDiamonds int not null,
                                           bowPurchased bool not null,
                                           crownPurchased bool not null,
                                           hotWaterPurchased bool not null,
                                           candyPurchased bool not null,
                                           flowerPurchased bool not null,
                                           FOREIGN KEY (id) REFERENCES UserInfo(id)
);

delimiter //
create trigger if not exists createUserMoney
after insert on UserInfo
for each row
begin
        insert into purchaseData (
            id, currentDiamonds, bowPurchased, crownPurchased, hotWaterPurchased, candyPurchased, flowerPurchased
        )
        values (
            NEW.id, 0,false,false,false,false,false
        );
end //
delimiter ;