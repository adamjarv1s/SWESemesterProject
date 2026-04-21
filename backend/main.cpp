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
        std::cout << "BODY: " << body << std::endl;

        auto extractString = [&](const std::string& key) {
            std::regex r("\"" + key + "\":\"([^\"]+)\"");
            std::smatch m;
            return std::regex_search(body, m, r) ? m[1].str() : "";
        };
        auto extractInt = [&](const std::string& key) {
            std::regex r("\"" + key + "\":(\\d+)");
            std::smatch m;
            return std::regex_search(body, m, r) ? std::stoi(m[1].str()) : 0;
        };

        std::string name = extractString("name");
        std::string childName = extractString("childName");
        std::string pet  = extractString("pet");
        int pet_id  = extractInt("pet_id");
        int accountType  = extractInt("accountType");
        int avgCycleLength = extractInt("averageCycleLength");
        int avgPeriodLength = extractInt("averagePeriodLength");

        if (!name.empty()) {
            db.createAccount(name, childName, pet, pet_id, accountType, avgPeriodLength, avgCycleLength);
            std::cout << "Created account for: " << name << std::endl;
        } else {
            std::cout << "ERROR: Could not parse" << std::endl;
        }

        res.set_content("{\"status\": \"ok\"}", "application/json");
    });

    svr.Get("/get-user", [&db](const httplib::Request &, httplib::Response &res) {
        string name = db.getActiveUserName();
        res.set_content(name, "text/plain");
        std::cout << "name: " << name << std::endl;
    });

    svr.Get("/set-active-user", [&db](const httplib::Request& req, httplib::Response& res) {
        if (req.has_param("id")) {
            int userId = std::stoi(req.get_param_value("id"));
            std::cout << "Setting active user to: " << userId << std::endl;
            db.setActiveUser(userId);
            int verify = db.getUserId();
            std::cout << "Active user is now: " << verify << std::endl;
            res.set_content("{\"status\": \"ok\"}", "application/json");
        } else {
            res.status = 400;
            res.set_content("{\"error\": \"missing id param\"}", "application/json");
        }
    });

    svr.Get("/get-pet-id", [&db](const httplib::Request &, httplib::Response &res) {
        int petId = db.getActiveUserPetId();
        res.set_content(to_string(petId), "text/plain");
        std::cout << "pet_id: " << petId << std::endl;
    });

    svr.Get("/get-period-data", [&db](const httplib::Request &, httplib::Response &res) {
        string periods = db.getPeriodsAsString(db.getUserId());
        res.set_content(periods, "application/json");
        std::cout << "periods " << periods << std::endl;
    });

svr.Post("/log-period", [&db](const httplib::Request& req, httplib::Response& res) {
    try {
        std::string body = req.body;
        std::cout << "BODY: " << body << std::endl;
        std::regex json("\"currentDate\":\"([^\"]+)\".*?\"heaviness\":(\\d+),\"lastDay\":(true|false),\"description\":\"([^\"]*)\"");
        std::smatch match;
        if (std::regex_search(body, match, json)) {
            int heaviness = std::stoi(match[2]);
            db.logPeriod(db.getUserId(), match[1], heaviness, match[3] == "true", match[4]);
            std::cout << "Logged period in database" << std::endl;
        } else {
            std::cout << "NO REGEX MATCH" << std::endl;
        }
        res.set_content("{\"status\": \"ok\"}", "application/json");
    } catch (std::exception &e) {
        std::cerr << "log-period handler error: " << e.what() << std::endl;
        res.status = 500;
        res.set_content("{\"error\":\"server error\"}", "application/json");
    }
});

    svr.Post("/delete-period-day", [&db](const httplib::Request& req, httplib::Response& res) {
        std::string body = req.body;
        std::smatch m;
        if (std::regex_search(body, m, std::regex("\"currentDate\":\"([^\"]+)\""))) {
            std::string date = m[1];
            db.deletePeriodDay(db.getUserId(), date);
            std::cout << "Deleted period day: " << date << std::endl;
        }
        res.set_content("{\"status\": \"ok\"}", "application/json");
    });

    svr.Get("/get-profiles", [&db](const httplib::Request &, httplib::Response &res) {
        string profiles = db.getProfilesAsJson();
        res.set_content(profiles, "application/json");
        std::cout << "profiles: " << profiles << std::endl;
    });

    svr.Get("/get-diamonds", [&db](const httplib::Request &, httplib::Response &res) {
        int diamonds = db.getDiamonds(db.getUserId());
        res.set_content(to_string(diamonds), "text/plain");
        std::cout << "diamonds: " << diamonds << std::endl;
    });

    svr.Get("/print-all-data", [&db](const httplib::Request &req, httplib::Response &res) {
        db.printAllData(db.getUserId());
        res.set_content(R"({ "status": "printed" })", "application/json");
        std::cout << "data printed!" << std::endl;
    });

    svr.Get("/delete-all-data", [&db](const httplib::Request &req, httplib::Response &res) {
        db.deleteAllData(db.getUserId());
        res.set_content(R"({ "status": "deleted" })", "application/json");
        std::cout << "data deleted!" << std::endl;
    });

    svr.Get("/update-streak", [&db](const httplib::Request &, httplib::Response &res) {
        int streak = db.streakSystem(db.getUserId());
        res.set_content(to_string(streak), "text/plain");
        std::cout << "name: " << streak << std::endl;
    });

    svr.Get("/cycle-alerts", [&db](const httplib::Request& req, httplib::Response& res) {
        try {
            int user = db.getUserId();
            auto periods = db.getPeriodsAsVector(user);

            if (periods.empty()) {
                res.set_content("{\"message\":\"No data\"}", "application/json");
                return;
            }

            std::string today = getCurrentDate();
            int day = convertSQLDateToInt(today);
            int year = stoi(today.substr(0, 4));

            int lastStart = periods.back().first;
            double avg = averageCycleLength(periods);

            bool fertility = inFertilityWindow(day, year, lastStart, avg);
            bool missed = checkMissed(day, year, lastStart, avg);
            bool irregular = checkIrregular(day, year, lastStart, avg, periods);
            bool shouldStart = shouldBleedingStartingtoday(day, year, lastStart, avg);

            auto [accountType, childName] = db.getAccountTypeAndChildName(user);

            std::string json = "{";
            json += "\"fertility\":" + std::string(fertility ? "true" : "false") + ",";
            json += "\"missed\":" + std::string(missed ? "true" : "false") + ",";
            json += "\"irregular\":" + std::string(irregular ? "true" : "false") + ",";
            json += "\"shouldStart\":" + std::string(shouldStart ? "true" : "false") + ",";
            json += "\"accountType\":" + std::to_string(accountType) + ",";
            json += "\"childName\":\"" + childName + "\"";
            json += "}";

            res.set_content(json, "application/json");
        } catch (...) {
            res.status = 500;
            res.set_content("{\"error\":\"server error\"}", "application/json");
        }
    });

    svr.listen("0.0.0.0", 8080);
}