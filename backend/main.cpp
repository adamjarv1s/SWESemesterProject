#include <iostream>
#include "database.h"
#include "CycleMath.h"
#include "utilities.h"
#include <regex>
#include <string>
#include <vector>

#define NOMINMAX
#define WIN32_LEAN_AND_MEAN
#include "httplib.h"

//CAN'T USE NAMESPACE STD!!!!

/*int main(){
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
}*/
int main() {
    Database& db = Database::getInstance();
    db.runSQLFile("setup.sql");
    
    httplib::Server svr;

    svr.set_pre_routing_handler([](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        if (req.method == "OPTIONS") {
            res.status = 204;
            return httplib::Server::HandlerResponse::Handled;
        }
        return httplib::Server::HandlerResponse::Unhandled;
    });

    svr.Post("/create-user", [&db](const httplib::Request& req, httplib::Response& res) {
        std::string body = req.body;
        
        std::regex json("\"name\":\"([^\"]+)\".*?\"pet\":\"([^\"]+)\".*?\"pet_id\":(\\d+).*?\"accountType\":(\\d+).*?\"averageCycleLength\":(\\d+)");
        std::smatch match;
        if (std::regex_search(body, match, json)) {
            db.createAccount(match[1], match[2], std::stoi(match[3]), std::stoi(match[4]), std::stoi(match[5]));
            std::cout << "Added user to database" << std::endl;
        }
        res.set_content("{\"status\": \"ok\"}", "application/json");
    });

    svr.Get("/get-user", [&db](const httplib::Request &, httplib::Response &res) {
        string name = db.getActiveUserName();
        res.set_content(name, "text/plain");
        std::cout << "name: " << name << std::endl;
    });

    svr.Get("/get-period-data", [&db](const httplib::Request &, httplib::Response &res) {
        string periods = db.getPeriodsAsString(db.getUserId());
        res.set_content(periods, "application/json");
        std::cout << "periods " << periods << std::endl;
    });

    svr.Post("/log-period", [&db](const httplib::Request& req, httplib::Response& res) {
        std::string body = req.body;
        
        std::regex json("\"currentDate\":\"([^\"]+)\".*\"startDate\":\"([^\"]+)\",\"heaviness\":(\\d+),\"lastDay\":(true|false),\"description\":\"([^\"]*)\"");
        std::smatch match;
        if (std::regex_search(body, match, json)) {
            db.logPeriod(db.getUserId(), match[1], match[2], std::stoi(match[3]), match[4] == "true", match[5]);
            std::cout << "Logged period in database" << std::endl;
        }
        res.set_content("{\"status\": \"ok\"}", "application/json");
    });

    svr.Get("/get-profiles", [&db](const httplib::Request &, httplib::Response &res) {
        string profiles = db.getProfilesAsJson();
        res.set_content(profiles, "application/json");
        std::cout << "profiles: " << profiles << std::endl;
    });

    svr.listen("0.0.0.0", 8080);
}