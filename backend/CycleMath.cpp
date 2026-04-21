#include <iostream>
#include <ctime>
#include <cmath>
#include <vector>
#include <utility>
#include <stack>
#include <string>
#include "CycleMath.h"
using namespace std;

//converts YYYY-MM-DD to int
int convertSQLDateToInt(string date){
    int year = stoi(date.substr(0,4));
    int month = stoi(date.substr(5,2));
    int day = stoi(date.substr(8,2));

    tm timeinfo = {};
    timeinfo.tm_year = year - 1900;
    timeinfo.tm_mon = month - 1;
    timeinfo.tm_mday = day;
    timeinfo.tm_isdst = -1;

    mktime(&timeinfo);

    return timeinfo.tm_yday + 1;
}

// returns whether a year is a leap year given the current year
bool isLeapYear(int year) {
    return (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
}

double averageCycleLength(vector<pair<int, int>> periods) {
    vector<int> cycleLengths;

    for (int i = 0; i < (int)periods.size() - 1; i++) {
        int cycleLength = 0;

        if (periods[i + 1].first < periods[i].first) {
            if (isLeapYear(periods[i].second)) {
                cycleLength += (366 - periods[i].first);
            } else {
                cycleLength += (365 - periods[i].first);
            }
            cycleLength += periods[i + 1].first;
        } else {
            cycleLength = periods[i + 1].first - periods[i].first;
        }

        cycleLengths.push_back(cycleLength);
    }

    double sum = 0.0;
    for (auto cycleLength : cycleLengths) sum += cycleLength;

    return sum / cycleLengths.size();
}

//gives a boolean of whether or not bleeding should start that day given the day (1-366), the current year, the last start day (1-366), and the average cycle length
bool shouldBleedingStartingtoday(int day, int year, int lastStart, double averageCycle) {
    int roundedCycle = round(averageCycle);
    int result;

    if (day < lastStart) {
        year--;
        result = (isLeapYear(year) ? 366 : 365) - lastStart + day;
    } else {
        result = day - lastStart;
    }

    return result == roundedCycle;
}

bool inFertilityWindow(int day, int year, int lastStart, double averageCycle) {
    int roundedCycle = round(averageCycle);
    int upperBound = roundedCycle - 12;
    int lowerBound = roundedCycle - 19;
    int result;

    if (day < lastStart) {
        year--;
        result = (isLeapYear(year) ? 366 : 365) - lastStart + day;
    } else {
        result = day - lastStart;
    }

    return result >= lowerBound && result <= upperBound;
}

bool checkMissed(int day, int year, int lastStart, double averageCycle) {
    int result;

    if (day < lastStart) {
        year--;
        result = (isLeapYear(year) ? 366 : 365) - lastStart + day;
    } else {
        result = day - lastStart;
    }

    return result >= 42;
}

bool checkIrregular(int day, int year, int lastStart, double averageCycle, vector<pair<int, int>> periods) {
    if (periods.size() < 5) return false;

    int roundedCycle = round(averageCycle);
    int result;

    if (day < lastStart) {
        year--;
        result = (isLeapYear(year) ? 366 : 365) - lastStart + day;
    } else {
        result = day - lastStart;
    }

    return result >= roundedCycle + 7;
}

bool checkLastCycleUnder21(int day, int year, int lastStart, double averageCycle, bool notConcernedFlag) {
    if (notConcernedFlag) return false;

    int result;

    if (day < lastStart) {
        year--;
        result = (isLeapYear(year) ? 366 : 365) - lastStart + day;
    } else {
        result = day - lastStart;
    }

    return result < 21;
}

bool checkLastThreeUnder21(vector<pair<int, int>> periods, bool notConcernedFlag) {
    if (periods.size() < 4 || notConcernedFlag) return false;

    for (int i = periods.size() - 1; i > (int)periods.size() - 4; i--) {
        int day = periods[i].first;
        int year = periods[i].second;
        int lastStart = periods[i - 1].first;
        double avg = averageCycleLength(periods);

        if (!checkLastCycleUnder21(day, year, lastStart, avg, false)) return false;
    }

    return true;
}

bool checkLastCycleOver35(int day, int year, int lastStart, double averageCycle, bool notConcernedFlag) {
    if (notConcernedFlag) return false;

    int result;

    if (day < lastStart) {
        year--;
        result = (isLeapYear(year) ? 366 : 365) - lastStart + day;
    } else {
        result = day - lastStart;
    }

    return result > 35;
}

bool checkLastThreeOver35(vector<pair<int, int>> periods, bool notConcernedFlag) {
    if (periods.size() < 4 || notConcernedFlag) return false;

    for (int i = periods.size() - 1; i > (int)periods.size() - 4; i--) {
        int day = periods[i].first;
        int year = periods[i].second;
        int lastStart = periods[i - 1].first;
        double avg = averageCycleLength(periods);

        if (!checkLastCycleOver35(day, year, lastStart, avg, false)) return false;
    }

    return true;
}

bool checkNoPeriodIn90Days(int day, int year, int lastStart, bool notConcernedFlag) {
    if (notConcernedFlag) return false;

    int result;

    if (day < lastStart) {
        year--;
        result = (isLeapYear(year) ? 366 : 365) - lastStart + day;
    } else {
        result = day - lastStart;
    }

    return result >= 90;
}

bool checkBleedingFor7Days(int day, int year, int startDay, bool notConcernedFlag) {
    if (notConcernedFlag) return false;

    int result;

    if (day < startDay) {
        year--;
        result = (isLeapYear(year) ? 366 : 365) - startDay + day;
    } else {
        result = day - startDay;
    }

    return result >= 7;
}

bool checkBleedingAfterStopped(int day, int year, int bleedingEndDay, bool notConcernedFlag) {
    if (notConcernedFlag) return false;

    int result;

    if (day < bleedingEndDay) {
        year--;
        result = (isLeapYear(year) ? 366 : 365) - bleedingEndDay + day;
    } else {
        result = day - bleedingEndDay;
    }

    return result >= 1 && result <= 10;
}