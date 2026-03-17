#include <iostream>
#include <vector>
#include <string>
#include <utility>
#include <mariadb/conncpp.hpp>
#include "database.h"
#include "CycleMath.h"
#include "utilities.h"
#include <memory>

//A lot of the SQL stuff was taken from this lovely tutorial on mariadb
// https://mariadb.com/resources/blog/how-to-connect-c-programs-to-mariadb/

/* Database here is a something called a singleton class
That means only one instance of it can exist at a time.
*/

  Database& Database::getInstance(){
    static Database instance;
    return instance;
  }


  Database::Database(){
    try{
      string password;
      std::cout << "Enter password" << std::endl;
      std::cin >> password;
      std::cout << std::endl;

      sql::Driver* driver = sql::mariadb::get_driver_instance();
      sql::SQLString url("jdbc:mariadb://127.0.0.1:3306/uterusdata");
      sql::Properties properties({
        //WE NEED TO CHANGE THIS DESPERATELY ANYONE WITH ACCESS TO THIS
        //CODE CAN SEE THIS
        {"user", "root"},
        {"password", password}
        });
        
        conn.reset (driver->connect(url, properties));
        std::cout << "I worked!" << std::endl;
        } catch (sql::SQLException &e){
          std::cerr << "If you see this, talk to Abby! " << e.what() << std::endl;
    }
  }
    
  Database::~Database(){
    if (conn) conn->close();
  }

  //create account! this is a good template for what other functions will look like.
  //if at any point the SQL gets too complicated ask Abby for help <3
  void Database::createAccount(string name, string pet, int accountType){
    try {
      std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement("insert into userinfo (name, pet, `Type`, streak, lastDay) values (?, ?, ?, ?, ?)"));

      stmnt->setString(1, name);
      stmnt->setString(2, pet);
      stmnt->setInt(3, accountType);
      stmnt->setInt(4, 0);
      stmnt->setDateTime(5, getCurrentDate());

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

void Database::logPeriod(int user, string currentDate, string startDate, int heaviness, bool lastDay) {
    try {
        int currentLength = convertSQLDateToInt(currentDate) - convertSQLDateToInt(startDate);

        std::unique_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(
            "INSERT INTO perioddata (id, currentDate, startDate, currentLength, heaviness, lastDay) "
            "VALUES (?, ?, ?, ?, ?, ?)"
        ));

        stmnt->setInt(1, user);
        stmnt->setString(2, currentDate);
        stmnt->setString(3, startDate);
        stmnt->setInt(4, currentLength);
        stmnt->setInt(5, heaviness);
        stmnt->setBoolean(6, lastDay);

        stmnt->executeUpdate();

    } catch (sql::SQLException &e) {
        cerr << "SQL Error: " << e.what() << endl;
        cerr << "SQL State: " << e.getSQLState() << endl;
    }
}

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