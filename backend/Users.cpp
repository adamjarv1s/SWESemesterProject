#include "Users.h"
#include <iostream>

Users::Users(int i, std::string n, std::string p, int a, int l){
    idNum = i;
    name = n;
    petType = p;
    accType = a;
    streak = 0;
    lastLoginDate = l;
}
// Getter Functions
int Users::getIdNum(){
    return idNum;
}
std::string Users::getName(){
    return name;
}
std::string Users::getPetType(){
    return petType;
}
int Users::getAccType(){
    return accType;
}
int Users::getStreak(){
    return streak;
}
int Users::getLastLoginDate(){
    return lastLoginDate;
}

// Setter Functions
void Users::setName(std::string n){
    name = n;
}
void Users::setPetType(std::string p){
    petType = p;
}
void Users::setAccType(int a){
    accType = a;
}
void Users::setStreak(int s){
    streak = s;
}
void Users::setLastLoginDate(int l){
    lastLoginDate = l;
}

void Users::updateStreak(bool loggedInToday, int day, int year){
    bool leapYear;

    if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) {
        leapYear = true;
    } else {
        leapYear = false;
    }

    if (!loggedInToday) {
        return;
    }

    if (day - lastLoginDate == 42) {
        streak = 0;
        return;
    }

    if (!leapYear) {
        if (day <= 31) { // January
            if (lastLoginDate <= 31) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 59) { // February
            if (lastLoginDate <= 59 && lastLoginDate > 31) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 90) { // March
            if (lastLoginDate <= 90 && lastLoginDate > 59) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 120) { // April
            if (lastLoginDate <= 120 && lastLoginDate > 90) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 151) { // May
            if (lastLoginDate <= 151 && lastLoginDate > 120) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 181) { // June
            if (lastLoginDate <= 181 && lastLoginDate > 151) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 212) { // July
            if (lastLoginDate <= 212 && lastLoginDate > 181) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 243) { // August
            if (lastLoginDate <= 243 && lastLoginDate > 212) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 273) { // September
            if (lastLoginDate <= 273 && lastLoginDate > 243) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 304) { // October
            if (lastLoginDate <= 304 && lastLoginDate > 273) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 334) { // November
            if (lastLoginDate <= 334 && lastLoginDate > 304) {
                return;
            } else {
                streak = 0;
            }
        } else { // December
            if (lastLoginDate > 334) {
                return;
            } else {
                streak = 0;
            }
        }
    } else {
        if (day <= 31) { // January
            if (lastLoginDate <= 31) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 60) { // February
            if (lastLoginDate <= 60 && lastLoginDate > 31) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 91) { // March
            if (lastLoginDate <= 91 && lastLoginDate > 60) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 121) { // April
            if (lastLoginDate <= 121 && lastLoginDate > 91) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 152) { // May
            if (lastLoginDate <= 152 && lastLoginDate > 121) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 182) { // June
            if (lastLoginDate <= 182 && lastLoginDate > 152) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 213) { // July
            if (lastLoginDate <= 213 && lastLoginDate > 182) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 244) { // August
            if (lastLoginDate <= 244 && lastLoginDate > 213) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 274) { // September
            if (lastLoginDate <= 274 && lastLoginDate > 244) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 305) { // October
            if (lastLoginDate <= 305 && lastLoginDate > 274) {
                return;
            } else {
                streak = 0;
            }
        } else if (day <= 335) { // November
            if (lastLoginDate <= 335 && lastLoginDate > 305) {
                return;
            } else {
                streak = 0;
            }
        } else { // December
            if (lastLoginDate > 335) {
                return;
            } else {
                streak = 0;
            }
        }
    }
}