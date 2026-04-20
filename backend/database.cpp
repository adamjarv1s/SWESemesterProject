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
      sql::SQLString url("jdbc:mariadb://127.0.0.1:3306/uterusdata");
      sql::Properties properties({
        {"user", "root"},
        {"password", password}
        });
        
        conn.reset (driver->connect(url, properties));
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

  void Database::createAccount(string name, string pet, int pet_id, int accountType,int averagePeriodLength){
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
        "insert into userinfo (name, pet, pet_id, accountType, streak, lastActiveDay, activeUser, averagePeriodLength) "
        "values (?, ?, ?, ?, ?, ?, ?, ?)"
        ));

        stmnt->setString(1, name);
        stmnt->setString(2, pet);
      stmnt->setInt(3, pet_id);
      stmnt->setInt(4, accountType);
      stmnt->setInt(5, 1);
      stmnt->setDateTime(6, getCurrentDate());
      stmnt->setBoolean(7, 1);
      stmnt->setInt(8, averagePeriodLength);

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

        return 0;

    } catch (sql::SQLException &e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        return -1;
    }
}

string Database::getProfilesAsJson() {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "SELECT name, pet, accountType FROM userinfo"
        ));

        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());

        vector<tuple<string, string, int>> profiles;

        while (res->next()) {
            string name = res->getString("name");
            string pet = res->getString("pet");
            int accountType = res->getInt("accountType");

            profiles.push_back(make_tuple(name, pet, accountType));
        }

            std::string json = "[";

        for (size_t i = 0; i < profiles.size(); ++i) {
            const auto& [name, pet, accountType] = profiles[i];

            json += "{";
            json += "\"name\":\"" + name + "\",";
            json += "\"pet\":\"" + pet + "\",";
            json += "\"accountType\":" + std::to_string(accountType);
            json += "}";

            if (i != profiles.size() - 1) {
                json += ",";
            }
        }

        json += "]";
        return json;

    } catch (sql::SQLException &e) {
        cerr << "SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
        return "[]";
    }
}

void Database::changeActiveUser(int user){
    return;
}

//
//PERIOD CREATION FUNCTIONS!!!
//

void Database::logPeriod(int user, string currentDate,
                         int heaviness, bool lastDay, string description) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "INSERT INTO perioddata "
            "(id, Currentdate, Heaviness, FirstDay, LastDay, predicted, description) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)"
        ));

        stmnt->setInt(1, user);
        stmnt->setString(2, currentDate);
        stmnt->setInt(3, heaviness);
        stmnt->setBoolean(4, true);      // FirstDay
        stmnt->setBoolean(5, lastDay);   // LastDay
        stmnt->setBoolean(6, false);     // predicted
        stmnt->setString(7, description);

        stmnt->executeUpdate();

        std::unique_ptr<sql::PreparedStatement> diamonds(conn->prepareStatement(
            "UPDATE purchaseData SET currentDiamonds = currentDiamonds + 5 WHERE id = ?"
        ));
        diamonds->setInt(1, user);
        diamonds->executeUpdate();



    } catch (sql::SQLException &e) {
        cerr << "LP SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
    }
    generatePredictedPeriod(user);
}

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

void Database::generatePredictedPeriod(int user) {
    clearPredictedPeriods(user);

    try {
        std::unique_ptr<sql::PreparedStatement> firstDayStmnt(conn->prepareStatement(
            "SELECT CurrentDate FROM perioddata "
            "WHERE id = ? AND FirstDay = TRUE AND predicted = FALSE "
            "ORDER BY CurrentDate DESC LIMIT 1"
        ));
        firstDayStmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(firstDayStmnt->executeQuery());
        if (!res->next()) return;
        string lastFirstDay = string(res->getString("CurrentDate"));

        std::unique_ptr<sql::PreparedStatement> infoStmnt(conn->prepareStatement(
            "SELECT averagePeriodLength FROM userinfo WHERE id = ?"
        ));
        infoStmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> infoRes(infoStmnt->executeQuery());
        if (!infoRes->next()) return;
        int periodLength = infoRes->getInt("averagePeriodLength") - 1;

        std::unique_ptr<sql::PreparedStatement> insertStmnt(conn->prepareStatement(
            "INSERT INTO perioddata (id, currentDate, heaviness, firstDay, lastDay, predicted, description) "
            "VALUES (?, DATE_ADD(?, INTERVAL ? DAY), 2, ?, ?, TRUE, 'Predicted') "
            "ON DUPLICATE KEY UPDATE predicted = predicted"
        ));

        for (int dayOffset = 1; dayOffset <= periodLength; dayOffset++) {
            bool isFirstDay = (dayOffset == 1);
            bool isLastDay  = (dayOffset == periodLength);

            insertStmnt->setInt(1, user);
            insertStmnt->setString(2, lastFirstDay);
            insertStmnt->setInt(3, dayOffset);
            insertStmnt->setBoolean(4, isFirstDay);
            insertStmnt->setBoolean(5, isLastDay);
            insertStmnt->executeUpdate();
        }

    } catch (sql::SQLException &e) {
        cerr << "GPP SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
    }
}

/*
void Database::removePeriod(int user, string startDate) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "DELETE FROM perioddata WHERE id = ? AND startDate = ?"
        ));

        stmnt->setInt(1, user);
        stmnt->setString(2, startDate);

        stmnt->executeUpdate();

    } catch (sql::SQLException &e) {
        cerr << "SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
    }
}*/

void Database::removeOldestPeriod(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "DELETE FROM periodData "
            "WHERE PeriodID <= ("
            "  SELECT PeriodID FROM periodData "
            "  WHERE id = ? AND FirstDay = 1 AND predicted = FALSE "
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


string Database::getPeriodsAsString(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "SELECT CurrentDate, Heaviness, FirstDay, LastDay, predicted, description "
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
            string description = res->getString("description");

            string bgColor;
            if (isPredicted) {
                bgColor = "#D3D3D3";
            } else if (heaviness == 3) {
                bgColor = "#FF6161";
            } else if (heaviness == 2) {
                bgColor = "#FFA4A4";
            } else {
                bgColor = "#FFE0E0";
            }

            periods += "\"" + date + "\": {";
            periods += "\"heaviness\": " + std::to_string(heaviness) + ",";
            periods += "\"predicted\": " + std::string(isPredicted ? "true" : "false") + ",";
            periods += "\"description\": \"" + description + "\",";
            periods += "\"customStyles\": {";
            periods += "\"container\": {";
            periods += "\"backgroundColor\": \"" + bgColor + "\"";
            periods += ",\"borderRadius\": 6";
            if (firstDay) periods += ",\"startingDay\": true";
            if (lastDay)  periods += ",\"endingDay\": true";
            periods += "},";
            periods += "\"text\": {\"color\": \"" + std::string(isPredicted ? "#888" : "#000") + "\"}";
            periods += "}";
            periods += "}";
        }

        periods += "}";
        return periods;

    } catch (sql::SQLException &e) {
        cerr << "GPAS SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
        return "{}";
    }
}

//
//BUDDY/SHOP SECTION
//

//This function was generated by ChatGPT
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

void Database::purchaseItem(int user, int item){
    try{
        string purchase = "";
        int gems = 0;
        switch (item){
            case 1:
                purchase = "bowPurchased";
                gems = 100;
                break;
            case 2:
                purchase = "crownPurchased";
                gems = 100;
                break;
            case 3:
                purchase = "hotWaterPurchased";
                gems = 50;
                break;
            case 4:
                purchase = "candyPurchased";
                gems = 50;
                break;
            case 5:
                purchase = "flowerPurchased";
                gems = 100;
                break;
        }
        if (gems <= getDiamonds(user)){
            std::unique_ptr<sql::PreparedStatement> updateStmnt(
                conn->prepareStatement("UPDATE purchaseData SET " + purchase + " = ?, currentDiamonds = currentDiamonds - ? WHERE id = ?")
            );
            updateStmnt->setBoolean(1, true);
            updateStmnt->setInt(2, gems);
            updateStmnt->setBoolean(3, user);

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

        std::string trimmedLine = line;
        size_t s = trimmedLine.find_first_not_of(" \t");
        std::string upper = (s != std::string::npos) ? trimmedLine.substr(s) : "";
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
    ofstream data("../../../periodData.txt", ios::out);
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