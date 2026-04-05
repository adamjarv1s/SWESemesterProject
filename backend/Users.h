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
    std::string lastLoginDate;

public:
    Users(int i, std::string n, std::string p, int a, int s, std::string l);

    // Getter Functions
    int getIdNum();
    std::string getName();
    std::string getPetType();
    int getAccType();
    int getStreak();
    std::string getLastLoginDate();

    // Setter Functions
    void setName(std::string);
    void setPetType(std::string);
    void setAccType(int);
    void setStreak(int);
    void setLastLoginDate(std::string);
};

#endif