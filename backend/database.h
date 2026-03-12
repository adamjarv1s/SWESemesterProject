#ifndef DATABASE_H
#define DATABASE_H
#include <string>
#include <vector>
using namespace std;

int databaseInit(int argc, char *argv[]);
// todo:
string logPeriod(int user, string currentDate, string startDate, int heaviness, bool lastDay);
string logMissedPeriod(int user, string currentDate, string expectedStartDate, bool expectedLastDay);
string logIrregularPeriod(int user, string currentDate, string startDate, int heaviness, bool lastDay);
int getAverageCycleLength(int user);
string getAccountType(int user);
string getCurrentDate();
//let Adam do this once logic for pulling dates is written
int stringDateToInt(string date);
int getHeaviness(int user, string startDate);
void createAccount(int user, string accountType);
void deleteAccount(int user);
//See CycleMath.cpp to see why this is vector<pair<int, int>>
vector<pair<int, int>> getPeriods(int user);
string getName(int user);
void changeName(int user);
int getDiamonds(int user);
void spendDiamonds(int user, int price);
string getPetType(int user);
int getPetHappiness(int user);
string getNextPeriodStart(int user, string currentDate);
string getStartOfFertilityWindow(int user, string currentDate);
//vector in case one parent has multiple children
vector<int> getChildNumbers(int user, bool isParent);
//commented because I don't know what data type that'd be
//vector<???> getPetPurchases(int user);
int getCurrentStreak(int user);
void incrementCurrentStreak(int user);
#endif
