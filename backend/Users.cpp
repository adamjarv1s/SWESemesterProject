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

    // Checks if it's a leap year, then checks whether the last login was this month, if so, nothing happens
    // Then it checks if the last login date was in the previous month and if the user logged in today, if so, the streak is increased by 1
    // Next it checks if the last login date was more than a calendar month ago, if so, the streak is reset to 0
    // Finally, if the last login date was in the previous month but the user did not log in today, nothing happens

    if (!leapYear) {
        if (day <= 31) { // January
            if (lastLoginDate <= 31) {
                return;
            } else if (lastLoginDate > 334 && loggedInToday) {
                streak++;
            } else if (lastLoginDate < 334) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 59) { // February
            if (lastLoginDate <= 59 && lastLoginDate > 31) {
                return;
            } else if (lastLoginDate <= 31 && loggedInToday) {
                streak++;
            } else if (lastLoginDate > 31) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 90) { // March
            if (lastLoginDate <= 90 && lastLoginDate > 59) {
                return;
            } else if (lastLoginDate <= 59 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 31) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 120) { // April
            if (lastLoginDate <= 120 && lastLoginDate > 90) {
                return;
            } else if (lastLoginDate <= 90 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 59) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 151) { // May
            if (lastLoginDate <= 151 && lastLoginDate > 120) {
                return;
            } else if (lastLoginDate <= 120 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 90) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 181) { // June
            if (lastLoginDate <= 181 && lastLoginDate > 151) {
                return;
            } else if (lastLoginDate <= 151 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 120) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 212) { // July
            if (lastLoginDate <= 212 && lastLoginDate > 181) {
                return;
            } else if (lastLoginDate <= 181 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 151) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 243) { // August
            if (lastLoginDate <= 243 && lastLoginDate > 212) {
                return;
            } else if (lastLoginDate <= 212 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 181) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 273) { // September
            if (lastLoginDate <= 273 && lastLoginDate > 243) {
                return;
            } else if (lastLoginDate <= 243 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 212) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 304) { // October
            if (lastLoginDate <= 304 && lastLoginDate > 273) {
                return;
            } else if (lastLoginDate <= 273 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 243) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 334) { // November
            if (lastLoginDate <= 334 && lastLoginDate > 304) {
                return;
            } else if (lastLoginDate <= 304 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 273) {
                streak = 0;
            } else {
                return;
            }
        } else { // December
            if (lastLoginDate > 334) {
                return;
            } else if (lastLoginDate <= 334 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 304) {
                streak = 0;
            } else {
                return;
            }
        }
    } else {
        if (day <= 31) { // January
            if (lastLoginDate <= 31) {
                return;
            } else if (lastLoginDate > 334 && loggedInToday) {
                streak++;
            } else if (lastLoginDate < 334) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 60) { // February
            if (lastLoginDate <= 60 && lastLoginDate > 31) {
                return;
            } else if (lastLoginDate <= 31 && loggedInToday) {
                streak++;
            } else if (lastLoginDate > 31) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 91) { // March
            if (lastLoginDate <= 91 && lastLoginDate > 60) {
                return;
            } else if (lastLoginDate <= 60 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 31) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 121) { // April
            if (lastLoginDate <= 121 && lastLoginDate > 91) {
                return;
            } else if (lastLoginDate <= 91 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 60) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 152) { // May
            if (lastLoginDate <= 152 && lastLoginDate > 121) {
                return;
            } else if (lastLoginDate <= 121 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 91) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 182) { // June
            if (lastLoginDate <= 182 && lastLoginDate > 152) {
                return;
            } else if (lastLoginDate <= 152 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 121) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 213) { // July
            if (lastLoginDate <= 213 && lastLoginDate > 182) {
                return;
            } else if (lastLoginDate <= 182 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 152) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 244) { // August
            if (lastLoginDate <= 244 && lastLoginDate > 213) {
                return;
            } else if (lastLoginDate <= 213 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 182) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 274) { // September
            if (lastLoginDate <= 274 && lastLoginDate > 244) {
                return;
            } else if (lastLoginDate <= 244 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 213) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 305) { // October
            if (lastLoginDate <= 305 && lastLoginDate > 274) {
                return;
            } else if (lastLoginDate <= 274 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 244) {
                streak = 0;
            } else {
                return;
            }
        } else if (day <= 335) { // November
            if (lastLoginDate <= 335 && lastLoginDate > 305) {
                return;
            } else if (lastLoginDate <= 305 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 274) {
                streak = 0;
            } else {
                return;
            }
        } else { // December
            if (lastLoginDate > 335) {
                return;
            } else if (lastLoginDate <= 335 && loggedInToday) {
                streak++;
            } else if (lastLoginDate <= 305) {
                streak = 0;
            } else {
                return;
            }
        }
    }
}