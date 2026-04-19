#ifndef DATABASE_H
#define DATABASE_H
#include <string>
#include <vector>
#include <utility>
#include <mariadb/conncpp.hpp>
#include <memory>
#include <vector>
#include "utilities.h"
using namespace std;

class Database{
    public:
    static Database& getInstance();

    Database(const Database&) = delete;
    Database& operator=(const Database&) = delete;

    //USER FUNCTIONS (primarily use USERINFO table)
    void createAccount(string name, string pet, int pet_id, int type, int averageCycleLength);
    void deleteAccount(int user);
    int getUserId();
    string getActiveUserName();
    string getProfilesAsJson();
    vector<pair<int, int>> getPeriodsAsVector(int user);

    //PERIOD FUNCTIONS (primarily use periodData table)
    void logPeriod(int user, string currentDate, string startDate, int heaviness, bool lastDay, string description);
    void removeOldestPeriod(int user);
    string getPeriodsAsString(int user);

    //BUDDY/SHOP FUNCTIONS (primarily use PURCHASEDATA table)
    int streakSystem(int user);
    int getDiamonds(int user);
    int spendDiamonds(int user, int price);
    void purchaseItem(int user, int item);

    //UTILITY FUNCTIONS (Don't neatly fit into any category)
    void runSQLFile(const std::string& filename);
    void deleteAllData(int user);
    void printAllData(int user);

    //TBD/MIGHT NOT BE USED

    void logMissedPeriod(int user, string currentDate, string expectedStartDate, bool expectedLastDay);
    void logIrregularPeriod(int user, string currentDate, string startDate, int heaviness, bool lastDay);
    int getAverageCycleLength(int user);
    string getAccountType(int user);
    //string getCurrentDate();
    //let Adam do this once logic for pulling dates is written
    int stringDateToInt(string date);
    int getHeaviness(int user, string startDate);
    //See CycleMath.cpp to see why this is vector<pair<int, int>>
    vector<pair<int, int>> getPeriods(int user);
    void changeName(int user);
    string getPetType(int user);
    int getPetHappiness(int user);
    string getNextPeriodStart(int user, string currentDate);
    string getStartOfFertilityWindow(int user, string currentDate);
    //vector in case one parent has multiple children
    vector<int> getChildNumbers(int user, bool isParent);
    //commented because I don't know what data type that'd be
    //vector<???> getPetPurchases(int user);

private:
    Database();
    ~Database();
    std::unique_ptr<sql::Connection> conn;
};

#endif