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
bool checkLastCycleUnder21(int day, int year, int lastStart, double averageCycle, bool notConcernedFlag);
bool checkLastThreeUnder21(std::vector<std::pair<int,int>> periods, bool notConcernedFlag);
bool checkLastCycleOver35(int day, int year, int lastStart, double averageCycle, bool notConcernedFlag);
bool checkLastThreeOver35(std::vector<std::pair<int,int>> periods, bool notConcernedFlag);
bool checkBleedingAfterStopped(int day, int year, int bleedingEndDay, bool notConcernedFlag);
bool checkBleedingFor7Days(int day, int year, int startDay, bool notConcernedFlag);
bool checkNoPeriodIn90Days(int day, int year, int lastStart, bool notConcernedFlag);
#endif