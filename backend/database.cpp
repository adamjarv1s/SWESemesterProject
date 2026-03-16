#include <iostream>
#include <vector>
#include <string>
#include <mariadb/conncpp.hpp>
#include "database.h"
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