Create table IF NOT EXISTS UserInfo(
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       Name VARCHAR(100) NOT NULL,
                                       childName VARCHAR(100),
                                       Pet VARCHAR(100) NOT NULL,
                                       Pet_id int not null,
                                       accountType INT NOT NULL,
                                       Streak INT NOT NULL,
                                       lastActiveDay date NOT NULL,
                                       activeUser bool not null,
                                       averagePeriodLength int not null,
                                       averageCycleLength int not null
);
create table IF NOT EXISTS periodData(
                                         id INT NOT NULL,
                                         PeriodID INT AUTO_INCREMENT,
                                         PRIMARY KEY (PeriodID),
                                         CurrentDate DATE NOT NULL,
                                         Heaviness int not null,
                                         FirstDay bool not null default false,
                                         LastDay bool not null default false,
                                         predicted bool not null default false,
                                         fertileWindow bool not null default false,
                                         description VARCHAR(100),
                                         FOREIGN KEY (id) REFERENCES UserInfo(id),
                                         UNIQUE KEY unique_user_date (id, CurrentDate)
);
create table if not exists purchaseData(
                                        id INT AUTO_INCREMENT PRIMARY KEY,
                                        currentDiamonds int not null,
                                        currentOutfit int null null,
                                        bowPurchased bool not null default false,
                                        crownPurchased bool not null default false,
                                        hotWaterPurchased bool not null default false,
                                        candyPurchased bool not null default false,
                                        flowerPurchased bool not null default false,
                                        FOREIGN KEY (id) REFERENCES UserInfo(id)
);
delimiter //
create trigger if not exists createUserMoney
after insert on UserInfo
for each row
begin
        insert into purchaseData (
            id, currentDiamonds, currentOutfit
        )
        values (
            NEW.id, 0, 0
        );
end //
delimiter ;

delimiter //
create trigger if not exists deleteUserMoney
after delete on UserInfo
for each row
begin
        delete from purchaseData where id = OLD.id;
end //
delimiter ;