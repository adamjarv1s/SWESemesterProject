#include <iostream>
#include <ctime>
#include <string>

std::string getCurrentDate(){
    time_t timestamp = time(NULL);
    struct tm datetime = *localtime(&timestamp);
    char output[50];

    strftime(output, 50, "%Y-%m-%d", &datetime);
    return std::string(output);
}