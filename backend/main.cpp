#include <iostream>
#include "database.h"
#include "CycleMath.h"
#include "utilities.h"

using namespace std;

int main(){
    Database& db = Database::getInstance();
    db.removeOldestPeriod(1);
    db.removeOldestPeriod(1);
    db.logPeriod(1,getCurrentDate(), getCurrentDate(),3, false);
    db.logPeriod(1,"2026-03-18", getCurrentDate(),2, true);
    db.logPeriod(1,"2026-04-20", "2026-04-20",2, false);
    db.logPeriod(1,"2026-04-21", "2026-04-20",1, false);
    db.logPeriod(1,"2026-04-23", "2026-04-20",1, true);
    double val = averageCycleLength(db.getPeriodsAsVector(1));
    cout << val;
    return 0;
}