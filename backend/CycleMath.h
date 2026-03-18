#ifndef CYCLEMATH_H
#define CYCLEMATH_H

#include <vector>
#include <string>
#include <utility>

int convertSQLDateToInt(std::string date);
bool isLeapYear(int year);
double averageCycleLength(std::vector<std::pair<int,int>> periods);
bool shouldBleedingStartingtoday(int day, int year, int lastStart, double averageCycle);
bool inFertilityWindow(int day, int year, int lastStart, double averageCycle);
bool checkMissed(int day, int year, int lastStart, double averageCycle);
bool checkIrregular(int day, int year, int lastStart, double averageCycle, std::vector<std::pair<int,int>> periods);

#endif