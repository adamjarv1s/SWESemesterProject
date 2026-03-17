#include <iostream>
#include <ctime>
#include <vector>
#include <stack>
using namespace std;


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
        int cycleLength;

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
    if (day < lastStart) {
        year--;
        int result;
        if (isLeapYear(year)) {
            result = 366 - lastStart + day;
        } else {
            result = 365 - lastStart + day;
        }
        if (result == roundedCycle) {
            return true;
        }
        return false;
    } else {
        if (day - lastStart == roundedCycle) {
            return true;
        }
        return false;
    }
}

//gives a boolean of whether or not the user is in the fertility window given the day (1-366), the current year, the last start day (1-366), and the average cycle length
bool inFertilityWindow(int day, int year, int lastStart, double averageCycle) {
    int roundedCycle = round(averageCycle);
    int upperBound = roundedCycle - 12;
    int lowerBound = roundedCycle - 19;
    if (day < lastStart) {
        year--;
        int result;
        if (isLeapYear(year)) {
            result = 366 - lastStart + day;
        } else {
            result = 365 - lastStart + day;
        }
        if (result >= lowerBound && result <= upperBound) {
            return true;
        }
        return false;
    } else {
        if (day - lastStart >= lowerBound && day - lastStart <= upperBound) {
            return true;
        }
        return false;
    }
}

//gives a boolean of whether or not it's been very long since the last period, indicating either the user forgot or the user missed their period
bool checkMissed(int day, int year, int lastStart, double averageCycle) {
    int roundedCycle = round(averageCycle);
    if (day < lastStart) {
        year--;
        int result;
        if (isLeapYear(year)) {
            result = 366 - lastStart + day;
        } else {
            result = 365 - lastStart + day;
        }
        if (result >= 42) {
            return true;
        }
        return false;
    } else {
        if (day - lastStart >= 42) {
            return true;
        }
        return false;
    }
}

bool checkIrregular(int day, int year, int lastStart, double averageCycle, vector<pair<int, int>> periods) {
    if (periods.size() < 5) {
        return false;
    }
    int roundedCycle = round(averageCycle);
    if (day < lastStart) {
        year--;
        int result;
        if (isLeapYear(year)) {
            result = 366 - lastStart + day;
        } else {
            result = 365 - lastStart + day;
        }
        if (result >= roundedCycle + 7) {
            return true;
        }
        return false;
    } else {
        if (day - lastStart >= roundedCycle + 7) {
            return true;
        }
        return false;
    }
}