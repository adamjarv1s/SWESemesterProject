#include <iostream>
#include <ctime>
#include <cmath>
#include <vector>
#include <utility>
#include <stack>
#include <string>
#include "CycleMath.h"
using namespace std;

// converts SQL "YYYY-MM-DD to 1-366 int
int convertSQLDateToInt(string date){
    int year = stoi(date.substr(0,4));
    int month = stoi(date.substr(5,2));
    int day = stoi(date.substr(8,2));

    std::tm timeinfo = {};
    timeinfo.tm_year = year - 1900;
    timeinfo.tm_mon = month - 1;
    timeinfo.tm_mday = day;
    timeinfo.tm_isdst = -1;

    std::mktime(&timeinfo);

    return timeinfo.tm_yday + 1;
}

// returns whether a year is a leap year given the current year
bool isLeapYear(int year) {
    if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) {
        return true;
    } else {
        return false;
    }
}

// returns the average cycle length given a pair of ints where the first is the day (1-366), and the second is the year
double averageCycleLength(vector<pair<int, int>> periods) {
    vector<int> cycleLengths;

    for (int i = 0; i < periods.size() - 1; i++) {
        int cycleLength = 0;

        if (periods[i + 1].first < periods[i].first) {
            if (isLeapYear(periods[i].second)) {
                cycleLength += (366 - periods[i].first);
                cycleLength += periods[i + 1].first;
            } else {
                cycleLength += (365 - periods[i].first);
                cycleLength += periods[i + 1].first;
            }
        } else {
            cycleLength = periods[i + 1].first - periods[i].first;
        }

        cycleLengths.push_back(cycleLength);
    }

    double sum = 0.0;

    for (auto cycleLength : cycleLengths) {
        sum += cycleLength;
    }

    return sum / cycleLengths.size();
}

//gives a boolean of whether or not bleeding should start that day given the day (1-366), the current year, the last start day (1-366), and the average cycle length
bool shouldBleedingStartingtoday(int day, int year, int lastStart, double averageCycle) {
    int roundedCycle = round(averageCycle);
    int result;
    if (day < lastStart) {
        year--;
        if (isLeapYear(year)) {
            int result = 366 - lastStart + day;
        } else {
            int result = 365 - lastStart + day;
        }
    } else {
        result = day - lastStart;
    }
    return result == roundedCycle;
}

//gives a boolean of whether or not the user is in the fertility window given the day (1-366), the current year, the last start day (1-366), and the average cycle length
bool inFertilityWindow(int day, int year, int lastStart, double averageCycle) {
    int roundedCycle = round(averageCycle);
    int upperBound = roundedCycle - 12;
    int lowerBound = roundedCycle - 19;
    int result;

    if (day < lastStart) {
        year--;
        if (isLeapYear(year)) {
            int result = 366 - lastStart + day;
        } else {
            int result = 365 - lastStart + day;
        }
    } else {
        result = day - lastStart;
    }
    return result >= lowerBound && result <= upperBound;
}

//gives a boolean of whether or not it's been very long since the last period, indicating either the user forgot or the user missed their period
bool checkMissed(int day, int year, int lastStart, double averageCycle) {
    int roundedCycle = round(averageCycle);
    int result;
    if (day < lastStart) {
        year--;
        if (isLeapYear(year)) {
            int result = 366 - lastStart + day;
        } else {
            int result = 365 - lastStart + day;
        }
    } else {
        result = day - lastStart;
    }
    return result >= 42;
}

bool checkIrregular(int day, int year, int lastStart, double averageCycle, vector<pair<int, int>> periods) {
    if (periods.size() < 5) {
        return false;
    }
    int roundedCycle = round(averageCycle);
    int result = 0;
    if (day < lastStart) {
        year--;
        if (isLeapYear(year)) {
            int result = 366 - lastStart + day;
        } else {
            int result = 365 - lastStart + day;
        }
    } else {
        return day - lastStart;
    }
    return result >= roundedCycle + 7;
}