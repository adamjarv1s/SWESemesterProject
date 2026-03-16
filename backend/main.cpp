#include <iostream>
#include "database.h"
#include "utilities.h"

using namespace std;

int main(){
    Database& db = Database::getInstance();
    db.createAccount("Jared", "Shadow", 1);
    return 0;
}