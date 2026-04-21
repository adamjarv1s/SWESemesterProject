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
    db.purchaseItem(db.getUserId(), 5);
    
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
        
    std::regex json("\"name\":\"([^\"]+)\".*?\"pet\":\"([^\"]+)\".*?\"pet_id\":(\\d+).*?\"accountType\":(\\d+).*?\"averageCycleLength\":(\\d+).*?\"averagePeriodLength\":(\\d+)");
    std::smatch match;
    if (std::regex_search(body, match, json)) {
        db.createAccount(match[1], match[2], std::stoi(match[3]), std::stoi(match[3]), std::stoi(match[4]), std::stoi(match[6]), std::stoi(match[5]));
            std::cout << "Added user to database" << std::endl;
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

    svr.Get("/update-streak", [&db](const httplib::Request &, httplib::Response &res) {
        int streak = db.streakSystem(db.getUserId());
        res.set_content(to_string(streak), "text/plain");
        std::cout << "streak: " << streak << std::endl;
    });

    svr.Post("/update-purchase", [&db](const httplib::Request &req, httplib::Response &res) {
        int whichItem = std::stoi(req.get_param_value("item"));

        db.purchaseItem(db.getUserId(), whichItem);
        res.set_content("{\"status\": \"ok\"}", "application/json");
    });

    // Set current hat
    svr.Post("/set-current-headwear", [&db](const httplib::Request& req, httplib::Response& res) {
            if (req.has_param("headwear")) {
                int headwear = std::stoi(req.get_param_value("headwear"));
                db.setCurrentHeadwear(db.getUserId(), headwear);
                res.set_content("{\"status\": \"ok\"}", "application/json");
            } else {
                res.status = 400;
                res.set_content("{\"error\": \"missing headwear param\"}", "application/json");
            }
        });

        // Set current handheld
        svr.Post("/set-current-holdable", [&db](const httplib::Request& req, httplib::Response& res) {
            if (req.has_param("holdable")) {
                int holdable = std::stoi(req.get_param_value("holdable"));
                db.setCurrentHoldable(db.getUserId(), holdable);
                res.set_content("{\"status\": \"ok\"}", "application/json");
            } else {
                res.status = 400;
                res.set_content("{\"error\": \"missing holdable param\"}", "application/json");
            }
        });


    svr.Get("/get-diamonds", [&db](const httplib::Request &, httplib::Response &res) {
        int diamonds = db.getDiamonds(db.getUserId());
        res.set_content(to_string(diamonds), "text/plain");
        std::cout << "diamonds: " << diamonds << std::endl;
    });

    // new stuff for if the items are purchased (bools)
    svr.Get("/get-bow-purchased", [&db](const httplib::Request &, httplib::Response &res) {
        bool purchased = db.getBowPurchased(db.getUserId());
        res.set_content(to_string(purchased), "text/plain");
        std::cout << "bowPurchased: " << purchased << std::endl;
    });

    svr.Get("/get-crown-purchased", [&db](const httplib::Request &, httplib::Response &res) {
        bool purchased = db.getCrownPurchased(db.getUserId());
        res.set_content(to_string(purchased), "text/plain");
        std::cout << "crownPurchased: " << purchased << std::endl;
    });

    svr.Get("/get-hotwater-purchased", [&db](const httplib::Request &, httplib::Response &res) {
        bool purchased = db.getHotWaterPurchased(db.getUserId());
        res.set_content(to_string(purchased), "text/plain");
        std::cout << "hotWaterPurchased: " << purchased << std::endl;
    });

    svr.Get("/get-candy-purchased", [&db](const httplib::Request &, httplib::Response &res) {
        bool purchased = db.getCandyPurchased(db.getUserId());
        res.set_content(to_string(purchased), "text/plain");
        std::cout << "candyPurchased: " << purchased << std::endl;
    });

    svr.Get("/get-flower-purchased", [&db](const httplib::Request &, httplib::Response &res) {
        bool purchased = db.getFlowerPurchased(db.getUserId());
        res.set_content(to_string(purchased), "text/plain");
        std::cout << "flowerPurchased: " << purchased << std::endl;
    });

    svr.Get("/get-current-headwear", [&db](const httplib::Request &, httplib::Response &res) {
        int headwear = db.getCurrentHeadwear(db.getUserId());
        res.set_content(to_string(headwear), "text/plain");
        std::cout << "currentHeadwear: " << headwear << std::endl;
    });

    svr.Get("/get-current-holdable", [&db](const httplib::Request &, httplib::Response &res) {
        int holdable = db.getCurrentHoldable(db.getUserId());
        res.set_content(to_string(holdable), "text/plain");
        std::cout << "currentHoldable: " << holdable << std::endl;
    });

    // new stuff for if the items are purchased (bools)
    svr.Get("/get-bow-purchased", [&db](const httplib::Request &, httplib::Response &res) {
        bool purchased = db.getBowPurchased(db.getUserId());
        res.set_content(to_string(purchased), "text/plain");
        std::cout << "bowPurchased: " << purchased << std::endl;
    });

    svr.Get("/get-crown-purchased", [&db](const httplib::Request &, httplib::Response &res) {
        bool purchased = db.getCrownPurchased(db.getUserId());
        res.set_content(to_string(purchased), "text/plain");
        std::cout << "crownPurchased: " << purchased << std::endl;
    });

    svr.Get("/get-hotwater-purchased", [&db](const httplib::Request &, httplib::Response &res) {
        bool purchased = db.getHotWaterPurchased(db.getUserId());
        res.set_content(to_string(purchased), "text/plain");
        std::cout << "hotWaterPurchased: " << purchased << std::endl;
    });

    svr.Get("/get-candy-purchased", [&db](const httplib::Request &, httplib::Response &res) {
        bool purchased = db.getCandyPurchased(db.getUserId());
        res.set_content(to_string(purchased), "text/plain");
        std::cout << "candyPurchased: " << purchased << std::endl;
    });

    svr.Get("/get-flower-purchased", [&db](const httplib::Request &, httplib::Response &res) {
        bool purchased = db.getFlowerPurchased(db.getUserId());
        res.set_content(to_string(purchased), "text/plain");
        std::cout << "flowerPurchased: " << purchased << std::endl;
    });

    svr.Get("/get-current-headwear", [&db](const httplib::Request &, httplib::Response &res) {
        int headwear = db.getCurrentHeadwear(db.getUserId());
        res.set_content(to_string(headwear), "text/plain");
        std::cout << "currentHeadwear: " << headwear << std::endl;
    });

    svr.Get("/get-current-holdable", [&db](const httplib::Request &, httplib::Response &res) {
        int holdable = db.getCurrentHoldable(db.getUserId());
        res.set_content(to_string(holdable), "text/plain");
        std::cout << "currentHoldable: " << holdable << std::endl;
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

    svr.listen("0.0.0.0", 8080);
}