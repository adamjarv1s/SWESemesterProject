#include "Users.h"
#include <iostream>

Users::Users(int i, std::string n, std::string p, int a, int s, std::string l){
    idNum = i;
    name = n;
    petType = p;
    accType = a;
    streak = s;
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
std::string Users::getLastLoginDate(){
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
void Users::setLastLoginDate(std::string l){
    lastLoginDate = l;
}