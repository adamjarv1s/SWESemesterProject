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

  void Database::createAccount(string name, string pet, int pet_id, int accountType, int type, int averagePeriodLength, int averageCycleLength){
    try {
      std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement("insert into userinfo (name, pet, pet_id, accountType, streak, lastActiveDay, activeUser, averageCycleLength) values (?, ?, ?, ?, ?, ?, ?)"));

      stmnt->setString(1, name);
      stmnt->setString(2, pet);
      stmnt->setInt(3, pet_id);
      stmnt->setInt(4, accountType);
      stmnt->setInt(5, 1);
      stmnt->setDateTime(6, getCurrentDate());
      stmnt->setBoolean(7, 1);
      stmnt->setInt(8, averageCycleLength);

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

//
//PERIOD CREATION FUNCTIONS!!!
//

void Database::logPeriod(int user, string currentDate, string startDate, int heaviness, bool lastDay, string description) {
    try {
        int currentLength = convertSQLDateToInt(currentDate) - convertSQLDateToInt(startDate);

        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "INSERT INTO perioddata (id, currentDate, startDate, currentLength, heaviness, lastDay, description) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)"
            "ON DUPLICATE KEY UPDATE "
            "heaviness = VALUES(heaviness), "
            "lastDay = VALUES(lastDay)"
        ));

        stmnt->setInt(1, user);
        stmnt->setString(2, currentDate);
        stmnt->setString(3, startDate);
        stmnt->setInt(4, currentLength);
        stmnt->setInt(5, heaviness);
        stmnt->setBoolean(6, lastDay);
        stmnt->setString(7, description);

        stmnt->executeUpdate();


        std::unique_ptr<sql::PreparedStatement> updateStmnt2(
            conn->prepareStatement("UPDATE purchaseData SET currentDiamonds = currentDiamonds + ? WHERE id = ?")
        );
        updateStmnt2->setInt(1, 5);
        updateStmnt2->setInt(2, user);

        updateStmnt2->executeUpdate();
    }catch (sql::SQLException &e) {
        cerr << "SQL Error: " << e.what() << endl;
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

vector<pair<int, int>> Database::getPeriodsAsVector(int user) {
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "SELECT * FROM perioddata WHERE id = ? AND lastday = 1 ORDER BY StartDate"
        ));

        stmnt->setInt(1, user);

        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());

        vector<pair<int, int>> periods;

        while (res->next()) {
            string date = res->getString("StartDate");

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


string Database::getPeriodsAsString(int user){
    try {
        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "SELECT * FROM perioddata WHERE id = ? ORDER BY StartDate"
        ));

        stmnt->setInt(1, user);
        std::unique_ptr<sql::ResultSet> res(stmnt->executeQuery());

        string periods = "{";
        bool first = true;

        while (res->next()) {
            if (!first) periods += ",";
            first = false;

            string date = res->getString("currentDate");
            string start = res->getString("startDate");
            int heaviness = res->getInt("heaviness");
            bool lastDay = res->getBoolean("lastDay");
            string description = res->getString("description");

            string bgColor;
            if (heaviness == 3) bgColor = "#FF6161";
            else if (heaviness == 2) bgColor = "#FFA4A4";
            else bgColor = "#FFE0E0";

            periods += "\"" + date + "\": {";
            periods += "\"heaviness\": " + std::to_string(heaviness) + ",";
            periods += "\"description\": \"" + description + "\",";
            periods += "\"customStyles\": {";
            periods += "\"container\": {";
            periods += "\"backgroundColor\": \"" + bgColor + "\",";
            periods += "\"borderRadius\": 6";
            if (date == start) periods += ", \"startingDay\": true";
            if (lastDay) periods += ", \"endingDay\": true";
            periods += "},";
            periods += "\"text\": { \"color\": \"#000\" }";
            periods += "}";
            periods += "}";
        }

        periods += "}";
        return periods;

    } catch (sql::SQLException &e) {
        cerr << "SQL Error: " << e.what() << endl;
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
        int affected = stmnt->executeUpdate();

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
        int affected = stmnt->executeUpdate();
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
                purchase = "bowPurchased";
                gems = 100;
                break;
            case 4:
                purchase = "hotWaterPackPurchased";
                purchase = "hotWaterPackPurchased";
                gems = 50;
                break;
            case 5:
                purchase = "candyPurchased";
                gems = 50;
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
    std::stringstream buffer;
    buffer << file.rdbuf();
    std::string sql = buffer.str();

    std::unique_ptr<sql::Statement> stmt(conn->createStatement());

    std::stringstream ss(sql);
    std::string query;

    while (std::getline(ss, query, ';')) {
        if (query.find_first_not_of(" \n\t") == std::string::npos) continue;

        try {
            stmt->execute(query);
        } catch (sql::SQLException &e) {
            std::cerr << "Uh oh! Line: \n" << query << "\n";
            std::cerr << e.what() << std::endl;
        }
    }

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