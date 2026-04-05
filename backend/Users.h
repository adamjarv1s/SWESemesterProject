#ifndef USERS_H
#define USERS_H

#include <vector>
#include <string>

class Users{
private:
    int idNum;
    std::string name;
    std::string petType;
    int accType; // Account type... 0 is individual, 1 is parent-controlled
    int streak;
    int lastLoginDate;

public:
    Users(int i, std::string n, std::string p, int a, int l);

    // Getter Functions
    int getIdNum();
    std::string getName();
    std::string getPetType();
    int getAccType();
    int getStreak();
    int getLastLoginDate();

    // Setter Functions
    void setName(std::string);
    void setPetType(std::string);
    void setAccType(int);
    void setStreak(int);
    void setLastLoginDate(int);

    void updateStreak(bool loggedInToday, int day, int year);
};

#endif