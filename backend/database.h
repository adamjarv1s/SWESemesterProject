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

    // todo:
    void logPeriod(int user, string currentDate, string startDate, int heaviness, bool lastDay, string description);
    void logMissedPeriod(int user, string currentDate, string expectedStartDate, bool expectedLastDay);
    void logIrregularPeriod(int user, string currentDate, string startDate, int heaviness, bool lastDay);
    void removeOldestPeriod(int user);
    
    int getAverageCycleLength(int user);
    string getAccountType(int user);
    //string getCurrentDate();
    //let Adam do this once logic for pulling dates is written
    int stringDateToInt(string date);
    int getHeaviness(int user, string startDate);
    void createAccount(string name, string pet, int pet_id, int type, int averageCycleLength);
    void deleteAccount(int user);
    //See CycleMath.cpp to see why this is vector<pair<int, int>>
    vector<pair<int, int>> getPeriods(int user);
    void changeName(int user);
    int getDiamonds(int user);
    int spendDiamonds(int user, int price);
    void purchaseItem(int user, int item);
    string getPetType(int user);
    int getPetHappiness(int user);
    string getNextPeriodStart(int user, string currentDate);
    string getStartOfFertilityWindow(int user, string currentDate);
    //vector in case one parent has multiple children
    vector<int> getChildNumbers(int user, bool isParent);
    //commented because I don't know what data type that'd be
    //vector<???> getPetPurchases(int user);
    int streakSystem(int user);
    vector<pair<int, int>> getPeriodsAsVector(int user);
    string getActiveUserName();
    string getPeriodsAsString(int user);
    int getUserId();
    void runSQLFile(const std::string& filename);
    string getProfilesAsJson();
    void deleteAllData();
    void printAllData(int user);

private:
    Database();
    ~Database();
    std::unique_ptr<sql::Connection> conn;
};

#endif