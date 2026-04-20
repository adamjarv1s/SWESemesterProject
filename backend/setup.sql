CREATE TABLE IF NOT EXISTS UserInfo(
    id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Pet VARCHAR(100) NOT NULL,
    Pet_id INT NOT NULL,
    accountType INT NOT NULL,
    Streak INT NOT NULL,
    lastActiveDay DATE NOT NULL,
    activeUser BOOL NOT NULL,
    averagePeriodLength INT NOT NULL,
    averageCycleLength INT NOT NULL
);

CREATE TABLE IF NOT EXISTS periodData(
    id INT NOT NULL,
    PeriodID INT AUTO_INCREMENT,
    PRIMARY KEY (PeriodID),
    CurrentDate DATE NOT NULL,
    Heaviness INT NOT NULL,
    FirstDay BOOL NOT NULL DEFAULT FALSE,
    LastDay BOOL NOT NULL DEFAULT FALSE,
    predicted BOOL NOT NULL DEFAULT FALSE,
    description VARCHAR(100),
    FOREIGN KEY (id) REFERENCES UserInfo(id),
    UNIQUE KEY unique_user_date (id, CurrentDate)
);

CREATE TABLE IF NOT EXISTS purchaseData(
    id INT NOT NULL,
    currentDiamonds INT NOT NULL,
    currentOutfit INT NULL,
    bowPurchased BOOL NOT NULL DEFAULT FALSE,
    crownPurchased BOOL NOT NULL DEFAULT FALSE,
    hotWaterPurchased BOOL NOT NULL DEFAULT FALSE,
    candyPurchased BOOL NOT NULL DEFAULT FALSE,
    flowerPurchased BOOL NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES UserInfo(id)
);

DELIMITER //
CREATE TRIGGER IF NOT EXISTS createUserMoney
AFTER INSERT ON UserInfo
FOR EACH ROW
BEGIN
    INSERT INTO purchaseData (id, currentDiamonds, currentOutfit)
    VALUES (NEW.id, 0, 0);
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS deleteUserMoney
AFTER DELETE ON UserInfo
FOR EACH ROW
BEGIN
    DELETE FROM purchaseData WHERE id = OLD.id;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS setPeriodFlags
BEFORE INSERT ON periodData
FOR EACH ROW
BEGIN
    DECLARE last DATE;
    IF NEW.predicted = FALSE THEN
        SELECT MAX(CurrentDate) INTO last
        FROM periodData
        WHERE id = NEW.id
          AND predicted = FALSE
          AND CurrentDate < NEW.CurrentDate
          AND DATEDIFF(NEW.CurrentDate, CurrentDate) <= 35;
        IF last IS NULL THEN
            SET NEW.FirstDay = TRUE;
        ELSE
            SET NEW.FirstDay = FALSE;
        END IF;
    END IF;
END //
DELIMITER ;