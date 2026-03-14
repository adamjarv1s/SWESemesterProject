#include <iostream>
#include <mariadb/conncpp.hpp>
#include "database.h"
#include <memory>

//This was directly taken from this lovely tutorial on mariadb
// https://mariadb.com/resources/blog/how-to-connect-c-programs-to-mariadb/

int databaseInit(int argc, char *argv[]){
 try{
   sql::Driver* driver = sql::mariadb::get_driver_instance();

   sql::SQLString url("jdbc:mariadb://127.0.0.1:3306/uterusdata");
   sql::Properties properties({
       //WE NEED TO CHANGE THIS DESPERATELY ANYONE WITH ACCESS TO THIS
       //CODE CAN SEE THIS
       {"user", "root"},
       {"password", "aqualung"}
       });

    std::unique_ptr<sql::Connection> conn(driver->connect(url, properties));

    conn->close();
   }

   catch (sql::SQLException &e){
     std::cerr << "If you see this, talk to Abby! " << e.what() << std::endl;
     return 1;
   }
    std::cout << "I worked!" << std::endl;
   return 0;
}
/*
std::string logPeriod(int user, std::string currentDate, std::string startDate, int heaviness, bool lastDay) {

}*/