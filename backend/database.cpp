#include <iostream>
#include <vector>
#include <string>
#include <utility>
#include <mariadb/conncpp.hpp>
#include "database.h"
#include "CycleMath.h"
#include "utilities.h"
#include <fstream>
#include <sstream>
#include <memory>
#include <conio.h>



//A lot of the SQL stuff was taken from this lovely tutorial on mariadb
// https://mariadb.com/resources/blog/how-to-connect-c-programs-to-mariadb/

//DIRECTORY:
//__________
//CREATION + DELETION OF DATABASE
//USER FUNCTIONS (primarily use USERINFO table)
//PERIOD FUNCTIONS (primarily use periodData table)
//BUDDY/SHOP FUNCTIONS (primarily use PURCHASEDATA table)
//UTILITY FUNCTIONS (Don't neatly fit into any category)

//
//CREATION + DELETION OF DATABASE!!!
//

  Database& Database::getInstance(){
    static Database instance;
    return instance;
  }


  Database::Database(){
    try{
      string password;
      char ch;
      std::cout << "Enter password" << std::endl;
        while ((ch = _getch()) != '\r') {
            if (ch == '\b') {
                if (!password.empty()) {
                    password.pop_back();
                    std::cout << "\b \b";
                }
             } else {
                password += ch;
               std::cout << '*';
        }
    }
    std::cout << std::endl;

      sql::Driver* driver = sql::mariadb::get_driver_instance();
      sql::SQLString url("jdbc:mariadb://127.0.0.1:3306/");
      sql::Properties properties({
        {"user", "root"},
        {"password", password}
        });

        conn.reset (driver->connect(url, properties));
        std::cout << "Database connected!" << std::endl;

        std::unique_ptr<sql::Statement> stmt(conn->createStatement());
        stmt->execute("CREATE DATABASE IF NOT EXISTS uterusdata");
        stmt->execute("USE uterusdata");

        runSQLFile("../../backend/setup.sql");
        std::cout << "I'm working!" << std::endl;

        } catch (sql::SQLException &e){
          std::cerr << "If you see this, talk to Abby! " << e.what() << std::endl;
    }
    
  }
    
  Database::~Database(){
    if (conn) conn->close();
  }

//
//USERINFO FUNCTIONS!!!
//

  void Database::createAccount(string name, string childName, string pet, int pet_id, int accountType,int averagePeriodLength, int averageCycleLength){
    try {

        std::unique_ptr<sql::PreparedStatement> deactivate(conn->prepareStatement(
            "UPDATE userinfo SET activeUser = 0"
        ));
        deactivate->executeUpdate();

        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
        "insert into userinfo (name, childName, pet, pet_id, accountType, streak, lastActiveDay, activeUser, averagePeriodLength, averageCycleLength) "
        "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ));

        stmnt->setString(1, name);
        stmnt->setString(2, childName);
        stmnt->setString(3, pet);
        stmnt->setInt(4, pet_id);
        stmnt->setInt(5, accountType);
        stmnt->setInt(6, 1);
        stmnt->setDateTime(7, getCurrentDate());
        stmnt->setBoolean(8, 1);
        stmnt->setInt(9, averagePeriodLength);
        stmnt->setInt(10, averageCycleLength);

        stmnt->executeUpdate();

        } catch (sql::SQLException &e) {
        cerr << "SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
    }
  }

void Database::deleteAccount(int user){
      try {
      std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement("delete from userinfo where id = ?"));

      stmnt->setInt(1, user);

      stmnt->executeUpdate();
        } catch (sql::SQLException &e) {
        cerr << "SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
    }
}

string Database::getActiveUserName() {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement(
                "SELECT name FROM userinfo WHERE activeUser = 1 LIMIT 1"
            )
        );

        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());

        if (res->next()) {
            return string(res->getString("name"));
        }

        return "No active user";

    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return "Chiikawa";
    }
}

int Database::getUserId() {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement(
                "SELECT id FROM userinfo WHERE activeUser = 1 LIMIT 1"
            )
        );

        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());

        if (res->next()) {
            return res->getInt("id");
        }

        return -1; // no active user

    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return -1;
    }
}

void Database::setActiveUser(int user){
    try {
        std::unique_ptr<sql::PreparedStatement> deactivate(conn->prepareStatement(
            "UPDATE userinfo SET activeUser = 0"
        ));
        deactivate->executeUpdate(); 

        std::unique_ptr<sql::PreparedStatement> activate(conn->prepareStatement(
            "UPDATE userinfo SET activeUser = 1 WHERE id = ?"
        ));
        activate->setInt(1, user);
        activate->executeUpdate();

        } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return;
    }
}

int Database::getActiveUserPetId() {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement(
                "SELECT pet_id FROM userinfo WHERE activeUser = 1 LIMIT 1"
            )
        );

        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());

        if (res->next()) {
            return res->getInt("pet_id");
        }

        return -1; // No active user

    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return -1;
    }
}

string Database::getProfilesAsJson() {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "SELECT id, name, pet, pet_id, accountType FROM userinfo"
        ));

        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());

        std::string json = "[";
        bool first = true;

        while (res->next()) {
            if (!first) json += ",";
            first = false;

            json += "{";
            json += "\"id\":" + std::to_string(res->getInt("id")) + ",";
            json += "\"name\":\"" + string(res->getString("name")) + "\",";
            json += "\"pet\":\"" + string(res->getString("pet")) + "\",";
            json += "\"pet_id\":" + std::to_string(res->getInt("pet_id")) + ",";
            json += "\"accountType\":" + std::to_string(res->getInt("accountType"));
            json += "}";
        }

        json += "]";
        return json;

    } catch (sql::SQLException &e) {
        cerr << "SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
        return "[]";
    }
}

std::pair<int, std::string> Database::getAccountTypeAndChildName(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "SELECT accountType, childName FROM userinfo WHERE id = ?"
        ));
        stmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());
        if (res->next()) {
            int accountType = res->getInt("accountType");
            std::string childName = res->isNull("childName") ? "" : std::string(res->getString("childName"));
            return { accountType, childName };
        }
        return { 0, "" };
    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return { 0, "" };
    }
}

//
//PERIOD CREATION FUNCTIONS!!!
//

//Resets predicted periods
void Database::clearPredictedPeriods(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "DELETE FROM perioddata WHERE id = ? AND predicted = TRUE"
        ));
        stmnt->setInt(1, user);
        stmnt->executeUpdate();
    } catch (sql::SQLException &e) {
        cerr << "CPP SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
    }
}

void Database::logPeriod(int user, string currentDate, int heaviness, bool lastDay, string description) {
    try {
        auto [periodLength, cycleLength] = getUserCycleLengths(user);

        std::unique_ptr<sql::PreparedStatement> checkStmnt(conn->prepareStatement(
            "SELECT COUNT(*) as cnt FROM perioddata "
            "WHERE id = ? AND predicted = FALSE AND fertileWindow = FALSE "
            "AND CurrentDate < ? "
            "AND CurrentDate >= DATE_SUB(?, INTERVAL ? DAY)"
        ));
        checkStmnt->setInt(1, user);
        checkStmnt->setString(2, currentDate);
        checkStmnt->setString(3, currentDate);
        checkStmnt->setInt(4, periodLength + 5);
        std::unique_ptr<sql::ResultSet> checkRes(checkStmnt->executeQuery());

        bool isFirstDay = true;
        if (checkRes->next()) {
            isFirstDay = checkRes->getInt("cnt") == 0;
        }

        std::unique_ptr<sql::PreparedStatement> cleanPred(conn->prepareStatement(
            "DELETE FROM perioddata "
            "WHERE id = ? AND predicted = TRUE "
            "AND CurrentDate >= ?"
        ));
        cleanPred->setInt(1, user);
        cleanPred->setString(2, currentDate);
        cleanPred->executeUpdate();

        if (isFirstDay) {
            std::unique_ptr<sql::PreparedStatement> cleanFertile(conn->prepareStatement(
                "DELETE FROM perioddata "
                "WHERE id = ? AND fertileWindow = TRUE "
                "AND CurrentDate >= ?"
            ));
            cleanFertile->setInt(1, user);
            cleanFertile->setString(2, currentDate);
            cleanFertile->executeUpdate();
        }

        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "INSERT INTO perioddata "
            "(id, CurrentDate, Heaviness, FirstDay, LastDay, predicted, fertileWindow, description) "
            "VALUES (?, ?, ?, ?, ?, FALSE, FALSE, ?) "
            "ON DUPLICATE KEY UPDATE "
            "Heaviness = VALUES(Heaviness), predicted = FALSE, fertileWindow = FALSE, "
            "FirstDay = VALUES(FirstDay), LastDay = VALUES(LastDay), description = VALUES(description)"
        ));
        stmnt->setInt(1, user);
        stmnt->setString(2, currentDate);
        stmnt->setInt(3, heaviness);
        stmnt->setBoolean(4, isFirstDay);
        stmnt->setBoolean(5, lastDay);
        stmnt->setString(6, description);
        stmnt->executeUpdate();

        std::unique_ptr<sql::PreparedStatement> diamonds(conn->prepareStatement(
            "UPDATE purchaseData SET currentDiamonds = currentDiamonds + 5 WHERE id = ?"
        ));
        diamonds->setInt(1, user);
        diamonds->executeUpdate();

    } catch (sql::SQLException &e) {
        cerr << "LP SQL Error: " << e.what() << endl;
    }

    try {
        auto periods = getPeriodsAsVector(user);
        if (periods.size() >= 2) {
            double avg = averageCycleLength(periods);
            int avgInt = (int)round(avg);

            std::unique_ptr<sql::PreparedStatement> updateAvg(conn->prepareStatement(
                "UPDATE userinfo SET averageCycleLength = ? WHERE id = ?"
            ));
            updateAvg->setInt(1, avgInt);
            updateAvg->setInt(2, user);
            updateAvg->executeUpdate();

            std::cout << "Updated averageCycleLength to: " << avgInt << std::endl;
        }
    } catch (std::exception &e) {
        cerr << "Avg update error: " << e.what() << endl;
    }

    try {
        generatePredictedPeriod(user);
    } catch (sql::SQLException &e) {
        cerr << "GPP (from logPeriod) SQL Error: " << e.what() << endl;
    } catch (std::exception &e) {
        cerr << "GPP std error: " << e.what() << endl;
    }
}

std::pair<int,int> Database::getUserCycleLengths(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "SELECT averagePeriodLength, averageCycleLength FROM userinfo WHERE id = ?"
        ));
        stmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());
        if (res->next()) {
            return { res->getInt("averagePeriodLength"), res->getInt("averageCycleLength") };
        }
        return { 7, 28 };
    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error in getUserCycleLengths: " << e.what() << std::endl;
        return { 7, 28 };
    }
}

void Database::generatePredictedPeriod(int user) {
    clearPredictedPeriods(user);

    try {
        std::unique_ptr<sql::PreparedStatement> typeStmnt(conn->prepareStatement(
            "SELECT accountType, averagePeriodLength, averageCycleLength FROM userinfo WHERE id = ?"
        ));
        typeStmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> typeRes(typeStmnt->executeQuery());
        if (!typeRes->next()) return;
        int accountType  = typeRes->getInt("accountType");
        int periodLength = typeRes->getInt("averagePeriodLength");
        int cycleLength  = typeRes->getInt("averageCycleLength"); // already updated by logPeriod

        std::unique_ptr<sql::PreparedStatement> firstDayStmnt(conn->prepareStatement(
            "SELECT CurrentDate FROM perioddata "
            "WHERE id = ? AND FirstDay = TRUE AND predicted = FALSE "
            "ORDER BY CurrentDate DESC LIMIT 1"
        ));
        firstDayStmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(firstDayStmnt->executeQuery());
        if (!res->next()) return;
        std::string lastFirstDay = std::string(res->getString("CurrentDate"));

        std::unique_ptr<sql::PreparedStatement> countStmnt(conn->prepareStatement(
            "SELECT COUNT(*) as cnt FROM perioddata "
            "WHERE id = ? AND predicted = FALSE AND fertileWindow = FALSE "
            "AND CurrentDate >= ? "
            "AND CurrentDate <= DATE_ADD(?, INTERVAL ? DAY)"
        ));
        countStmnt->setInt(1, user);
        countStmnt->setString(2, lastFirstDay);
        countStmnt->setString(3, lastFirstDay);
        countStmnt->setInt(4, periodLength + 5);
        std::unique_ptr<sql::ResultSet> countRes(countStmnt->executeQuery());
        int loggedDays = 0;
        if (countRes->next()) loggedDays = countRes->getInt("cnt");

        std::unique_ptr<sql::PreparedStatement> completeStmnt(conn->prepareStatement(
            "SELECT COUNT(*) as cnt FROM perioddata "
            "WHERE id = ? AND LastDay = TRUE AND predicted = FALSE "
            "AND CurrentDate >= ? "
            "AND CurrentDate <= DATE_ADD(?, INTERVAL ? DAY)"
        ));
        completeStmnt->setInt(1, user);
        completeStmnt->setString(2, lastFirstDay);
        completeStmnt->setString(3, lastFirstDay);
        completeStmnt->setInt(4, periodLength + 5);
        std::unique_ptr<sql::ResultSet> completeRes(completeStmnt->executeQuery());
        bool markedComplete = completeRes->next() && completeRes->getInt("cnt") > 0;

        std::string today = getCurrentDate();
        std::unique_ptr<sql::PreparedStatement> pastStmnt(conn->prepareStatement(
            "SELECT DATE_ADD(?, INTERVAL ? DAY) < ? as isPast"
        ));
        pastStmnt->setString(1, lastFirstDay);
        pastStmnt->setInt(2, periodLength - 1);
        pastStmnt->setString(3, today);
        std::unique_ptr<sql::ResultSet> pastRes(pastStmnt->executeQuery());
        bool periodIsPast = pastRes->next() && pastRes->getBoolean("isPast");

        bool periodComplete = markedComplete || periodIsPast;

        if (!periodComplete) {
            std::unique_ptr<sql::PreparedStatement> fillStmnt(conn->prepareStatement(
                "INSERT INTO perioddata (id, currentDate, heaviness, firstDay, lastDay, predicted, fertileWindow, description) "
                "VALUES (?, DATE_ADD(?, INTERVAL ? DAY), 0, FALSE, ?, TRUE, FALSE, '') "
                "ON DUPLICATE KEY UPDATE predicted = predicted"
            ));

            for (int offset = loggedDays; offset < periodLength; offset++) {
                bool isLastDay = (offset == periodLength - 1);
                fillStmnt->setInt(1, user);
                fillStmnt->setString(2, lastFirstDay);
                fillStmnt->setInt(3, offset);
                fillStmnt->setBoolean(4, isLastDay);
                fillStmnt->executeUpdate();
            }
        } else {
            std::unique_ptr<sql::PreparedStatement> markLast(conn->prepareStatement(
                "UPDATE perioddata SET lastDay = TRUE "
                "WHERE id = ? AND predicted = FALSE AND fertileWindow = FALSE "
                "AND CurrentDate >= ? "
                "AND CurrentDate <= DATE_ADD(?, INTERVAL ? DAY) "
                "ORDER BY CurrentDate DESC LIMIT 1"
            ));
            markLast->setInt(1, user);
            markLast->setString(2, lastFirstDay);
            markLast->setString(3, lastFirstDay);
            markLast->setInt(4, periodLength + 5);
            markLast->executeUpdate();
        }

        std::unique_ptr<sql::PreparedStatement> insertStmnt(conn->prepareStatement(
            "INSERT INTO perioddata (id, currentDate, heaviness, firstDay, lastDay, predicted, fertileWindow, description) "
            "VALUES (?, DATE_ADD(?, INTERVAL ? DAY), 0, ?, ?, TRUE, FALSE, '') "
            "ON DUPLICATE KEY UPDATE predicted = predicted"
        ));

        for (int dayOffset = cycleLength; dayOffset < cycleLength + periodLength; dayOffset++) {
            bool isFirstDay = (dayOffset == cycleLength);
            bool isLastDay  = (dayOffset == cycleLength + periodLength - 1);
            insertStmnt->setInt(1, user);
            insertStmnt->setString(2, lastFirstDay);
            insertStmnt->setInt(3, dayOffset);
            insertStmnt->setBoolean(4, isFirstDay);
            insertStmnt->setBoolean(5, isLastDay);
            insertStmnt->executeUpdate();
        }

        if (accountType == 0) {
            int fertileStart = cycleLength - 19;
            int fertileEnd   = cycleLength - 14;

            if (fertileStart >= 0 && fertileEnd >= fertileStart) {
                std::unique_ptr<sql::PreparedStatement> fertileStmnt(conn->prepareStatement(
                    "INSERT INTO perioddata (id, currentDate, heaviness, firstDay, lastDay, predicted, fertileWindow, description) "
                    "VALUES (?, DATE_ADD(?, INTERVAL ? DAY), 0, FALSE, FALSE, FALSE, TRUE, '') "
                    "ON DUPLICATE KEY UPDATE fertileWindow = fertileWindow"
                ));
                for (int dayOffset = fertileStart; dayOffset <= fertileEnd; dayOffset++) {
                    fertileStmnt->setInt(1, user);
                    fertileStmnt->setString(2, lastFirstDay);
                    fertileStmnt->setInt(3, dayOffset);
                    fertileStmnt->executeUpdate();
                }
            }
        }

    } catch (sql::SQLException &e) {
        std::cerr << "GPP SQL Error: " << e.what() << std::endl;
        std::cerr << "SQL State: " << e.getSQLState() << std::endl;
    }
}

//purely for debugging, was not ever added as a feature
void Database::removeOldestPeriod(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "DELETE FROM periodData "
            "WHERE PeriodID <= ("
            "  SELECT PeriodID FROM periodData "
            "  WHERE id = ? AND LastDay = 1 "
            "  ORDER BY PeriodID ASC LIMIT 1"
            ") AND id = ?"
        ));

        stmnt->setInt(1, user);
        stmnt->setInt(2, user);

        stmnt->executeUpdate();

    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        std::cerr << "SQL State: " << e.getSQLState() << std::endl;
    }
}

//gets period in a vector format for easy access, does date (int), year.
vector<pair<int, int>> Database::getPeriodsAsVector(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "SELECT CurrentDate FROM perioddata "
            "WHERE id = ? AND FirstDay = 1 AND predicted = FALSE "
            "ORDER BY CurrentDate"
        ));

        stmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());

        vector<pair<int, int>> periods;

        while (res->next()) {
            string date = res->getString("CurrentDate");
            int currentDate = convertSQLDateToInt(date);
            int year = stoi(date.substr(0, 4));
            periods.push_back({currentDate, year});
        }

        return periods;

    } catch (sql::SQLException &e) {
        cerr << "SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
        return {};
    }
}

//Technically this gets period as a json which can parsed for the frontend to display.
string Database::getPeriodsAsString(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "SELECT CurrentDate, Heaviness, FirstDay, LastDay, predicted, fertileWindow, description "
            "FROM perioddata WHERE id = ? ORDER BY CurrentDate"
        ));
        stmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());

        string periods = "{";
        bool first = true;

        while (res->next()) {
            if (!first) periods += ",";
            first = false;

            string date = res->getString("CurrentDate");
            int heaviness = res->getInt("Heaviness");
            bool firstDay = res->getBoolean("FirstDay");
            bool lastDay = res->getBoolean("LastDay");
            bool isPredicted = res->getBoolean("predicted");
            bool isFertile = res->getBoolean("fertileWindow");
            string description = res->getString("description");

            string bgColor;
            if (isFertile) bgColor = "#C78CFF";
            else if (isPredicted) bgColor = "#D3D3D3";
            else if (heaviness == 3) bgColor = "#FF6161";
            else if (heaviness == 2) bgColor = "#FFA4A4";
            else bgColor = "#FFE0E0";

            periods += "\"" + date + "\": {";
            periods += "\"heaviness\": " + std::to_string(heaviness) + ",";
            periods += "\"predicted\": " + std::string(isPredicted ? "true" : "false") + ",";
            periods += "\"fertileWindow\": " + std::string(isFertile ? "true" : "false") + ",";
            periods += "\"description\": \"" + description + "\",";
            periods += "\"customStyles\": {";
            periods += "\"container\": {";
            periods += "\"backgroundColor\": \"" + bgColor + "\"";
            periods += ",\"borderRadius\": 6";
            if (firstDay) periods += ",\"startingDay\": true";
            if (lastDay)  periods += ",\"endingDay\": true";
            periods += "},";
            periods += "\"text\": {\"color\": \"" + std::string(isPredicted? "#888" : "#000") + "\"}";
            periods += "}";
            periods += "}";
        }

        periods += "}";
        return periods;

    } catch (sql::SQLException &e) {
        cerr << "GPAS SQL Error: " << e.what() << endl;
        return "{}";
    }
}

void Database::deletePeriodDay(int user, string date) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "DELETE FROM perioddata WHERE id = ? AND CurrentDate = ? AND predicted = FALSE"
        ));
        stmnt->setInt(1, user);
        stmnt->setString(2, date);
        stmnt->executeUpdate();
    } catch (sql::SQLException &e) {
        cerr << "SQL Error: " << e.what() << endl;
    }
}

//
//BUDDY/SHOP SECTION
//

//This function was generated by ChatGPT
//This updates the streak counter depending on log-in month and gives gems accordingly
int Database::streakSystem(int userID) {
    try {
        // 1. Get last login date and current streak for the user
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement("SELECT lastActiveDay, streak FROM userinfo WHERE id = ?")
        );
        stmnt->setInt(1, userID);

        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());
        if (!res->next()) {
            std::cerr << "User not found: " << userID << std::endl;
            return -1;
        }

        std::string lastLoginStr = res->getString("lastActiveDay"); // YYYY-MM-DD
        int streak = res->getInt("streak");

        // 2. Extract year and month from last login
        int lastYear = std::stoi(lastLoginStr.substr(0, 4));
        int lastMonth = std::stoi(lastLoginStr.substr(5, 2));

        // 3. Extract current year and month
        std::string todayStr = getCurrentDate();
        int currentYear = std::stoi(todayStr.substr(0, 4));
        int currentMonth = std::stoi(todayStr.substr(5, 2));
        int gems = 0;

        // 4. Update streak logic
        if (currentYear == lastYear) {
            if (currentMonth == lastMonth) {
                // Already logged in this month -> streak unchanged
            } else if (currentMonth == lastMonth + 1) {
                streak++; // Consecutive month
                switch (streak){
                    case 3:
                        gems += 60;
                        break;
                    case 6:
                        gems += 105;
                        break;
                    case 12:
                        gems += 245;
                        break;
                    default:
                        gems += 30;
                        break;
                }
                if (streak % 12 == 0 && streak != 12){
                    gems += 215;
                }
            } else {
                streak = 0; // Skipped month(s)
            }
        } else if (currentYear == lastYear + 1 && lastMonth == 12 && currentMonth == 1) {
            streak++; // December -> January rollover
        } else {
            streak = 0; // Year skipped
        }

        // 5. Update database
        std::unique_ptr<sql::PreparedStatement> updateStmnt(
            conn->prepareStatement("UPDATE userinfo SET streak = ?, lastActiveDay = ? WHERE id = ?")
        );
        updateStmnt->setInt(1, streak);
        updateStmnt->setString(2, todayStr);
        updateStmnt->setInt(3, userID);

        updateStmnt->executeUpdate();

        std::unique_ptr<sql::PreparedStatement> updateStmnt2(
            conn->prepareStatement("UPDATE purchaseData SET currentDiamonds = currentDiamonds + ? WHERE id = ?")
        );
        updateStmnt2->setInt(1, gems);
        updateStmnt2->setInt(2, userID);

        updateStmnt2->executeUpdate();

        return streak;
    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        std::cerr << "SQL State: " << e.getSQLState() << std::endl;
        return -1;
    }
}

int Database::getDiamonds(int user){
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement(
                "SELECT currentDiamonds FROM purchaseData WHERE id = ? LIMIT 1"
            )
        );

        stmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());

        if (res->next()) {
            return res->getInt("currentDiamonds");
        }

        return -1;

    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return -1;
    }
}

// new stuff for if the items are purchased (bools)
bool Database::getBowPurchased(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement(
                "SELECT bowPurchased FROM purchaseData WHERE id = ? LIMIT 1"
            )
        );
        stmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());
        if (res->next()) {
            return res->getBoolean("bowPurchased");
        }
        return false;
    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return false;
    }
}

bool Database::getCrownPurchased(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement(
                "SELECT crownPurchased FROM purchaseData WHERE id = ? LIMIT 1"
            )
        );
        stmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());
        if (res->next()) {
            return res->getBoolean("crownPurchased");
        }
        return false;
    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return false;
    }
}

bool Database::getHotWaterPurchased(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement(
                "SELECT hotWaterPurchased FROM purchaseData WHERE id = ? LIMIT 1"
            )
        );
        stmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());
        if (res->next()) {
            return res->getBoolean("hotWaterPurchased");
        }
        return false;
    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return false;
    }
}

bool Database::getCandyPurchased(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement(
                "SELECT candyPurchased FROM purchaseData WHERE id = ? LIMIT 1"
            )
        );
        stmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());
        if (res->next()) {
            return res->getBoolean("candyPurchased");
        }
        return false;
    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return false;
    }
}

bool Database::getFlowerPurchased(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement(
                "SELECT flowerPurchased FROM purchaseData WHERE id = ? LIMIT 1"
            )
        );
        stmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());
        if (res->next()) {
            return res->getBoolean("flowerPurchased");
        }
        return false;
    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return false;
    }
}


int Database::getCurrentHeadwear(int user){ // 0 = nothin, 1 = flower, 2 = crown, 3 = bow
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement(
                "SELECT currentHeadwear FROM purchaseData WHERE id = ? LIMIT 1"
            )
        );
        stmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());
        if (res->next()) {
            return res->getInt("currentHeadwear");
        }
        return 0;
    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return 0;
    }
}


int Database::getCurrentHoldable(int user){ // 0 = nothin, 1 = flower, 2 = crown
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement(
                "SELECT currentHoldable FROM purchaseData WHERE id = ? LIMIT 1"
            )
        );
        stmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());
        if (res->next()) {
            return res->getInt("currentHoldable");
        }
        return 0;
    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return 0;
    }
}

void Database::setCurrentHeadwear(int user, int headwear){
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement(
                "UPDATE purchaseData SET currentHeadwear = ? WHERE id = ?"
            )
        );
        stmnt->setInt(1, headwear);
        stmnt->setInt(2, user);
        stmnt->executeUpdate();
    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
    }
}

void Database::setCurrentHoldable(int user, int holdable){
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(
            conn->prepareStatement(
                "UPDATE purchaseData SET currentHoldable = ? WHERE id = ?"
            )
        );
        stmnt->setInt(1, holdable);
        stmnt->setInt(2, user);
        stmnt->executeUpdate();
    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
    }
}


void Database::purchaseItem(int user, int item){
    try{
        string purchase = "";
        int gems = 0;
        switch (item){
            case 1:
                purchase = "flowerPurchased";
                gems = 100;
                break;
            case 2:
                purchase = "crownPurchased";
                gems = 100;
                break;
            case 3:
                purchase = "bowPurchased";
                gems = 100;
                break;
            case 4:
                purchase = "hotWaterPurchased";
                gems = 50;
                break;
            case 5:
                purchase = "candyPurchased";
                gems = 50;
                break;
        }
        if (gems <= getDiamonds(user)){
            std::unique_ptr<sql::PreparedStatement> updateStmnt(
                conn->prepareStatement("UPDATE purchaseData SET " + purchase + " = ?, currentDiamonds = currentDiamonds - ? WHERE id = ?")
            );
            updateStmnt->setBoolean(1, true);
            updateStmnt->setInt(2, gems);
            updateStmnt->setInt(3, user);

            updateStmnt->executeUpdate();
        }
    } catch (sql::SQLException &e) {
        cerr << "SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
    }
}

//
// UTILITIES SECTION
//


//I got ChatGPT help for this one because triggers are weird. -Abby
void Database::runSQLFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        std::cerr << "Could not open SQL file: " << filename << std::endl;
        return;
    }

    std::unique_ptr<sql::Statement> stmt(conn->createStatement());

    std::string line;
    std::string block;
    bool inTrigger = false;

    auto executeBlock = [&](const std::string& sql) {
        std::string trimmed = sql;
        size_t start = trimmed.find_first_not_of(" \n\t\r");
        if (start == std::string::npos) return;
        trimmed = trimmed.substr(start);
        try {
            stmt->execute(trimmed);
        } catch (sql::SQLException &e) {
            std::cerr << "SQL Error in block:\n" << trimmed << "\n";
            std::cerr << e.what() << std::endl;
        }
    };

    while (std::getline(file, line)) {
        if (!line.empty() && line.back() == '\r') line.pop_back();

        std::string upper = line;
        size_t s = upper.find_first_not_of(" \t");
        upper = (s != std::string::npos) ? upper.substr(s) : "";
        for (auto& c : upper) c = toupper(c);

        if (upper.rfind("DELIMITER //", 0) == 0) {
            inTrigger = true;
            block.clear();
            continue;
        }

        if (upper.rfind("DELIMITER ;", 0) == 0) {
            inTrigger = false;
            block.clear();
            continue;
        }

        if (inTrigger) {
            if (upper.rfind("END //", 0) == 0 || upper == "//") {
                block += "\nEND";
                executeBlock(block);
                block.clear();
            } else {
                block += line + "\n";
            }
        } else {
            block += line + "\n";
            if (line.find(';') != std::string::npos) {
                std::string toRun = block;
                size_t pos = toRun.rfind(';');
                if (pos != std::string::npos) toRun.erase(pos, 1);
                executeBlock(toRun);
                block.clear();
            }
        }
    }

    if (!block.empty()) executeBlock(block);

    std::cout << "SQL File ran!\n";
}

void Database::printAllData(int user){
    std::vector<std::string> tables;
    ofstream data("../../periodData.csv", ios::out);
    if (!data.is_open()){
        cout << "I didn't open!!!" << endl;
    }
    try {
      std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement("show tables"));
      std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());
      
      while (res->next()){
        tables.push_back(string(res->getString(1)));
      }

    for (auto table : tables){
    std::unique_ptr<sql::PreparedStatement> stmnt2(conn->prepareStatement("select * from " + table + " where id = ?"));
    stmnt2->setInt(1, user);
    
    std::unique_ptr<sql::ResultSet> res2(stmnt2->executeQuery());
    
    sql::ResultSetMetaData* meta = res2->getMetaData();
    int cols = meta->getColumnCount();

    while (res2->next()){
        for (int i =1; i<= cols; i++){
            data << meta->getColumnLabel(i) << ": " << res2->getString(i);
            if (i < cols){
                data << ", ";
            }
        }
         data << "\n";
    }
    data << "\n";
    }
    data.close();
    } catch (sql::SQLException &e) {
        cerr << "SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
    }
}

void Database::deleteAllData(int user){
    std::vector<std::string> tables;
    try {
      std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement("show tables"));
      std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());
      
      while (res->next()){
        tables.push_back(string(res->getString(1)));
      }

    for (auto table : tables){
        std::unique_ptr<sql::PreparedStatement> stmnt2(conn->prepareStatement("delete from " + table + " where id = ?"));
        stmnt2->setInt(1, user);
        stmnt2->executeUpdate();
    }
    } catch (sql::SQLException &e) {
        cerr << "SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
    }
}