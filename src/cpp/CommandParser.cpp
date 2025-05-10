#include "CommandParser.h"
#include <string>
#include <iostream>
#include <fstream>
#include <regex>
#include <sstream>
#include "../commands/addUrl.h"
#include "../commands/checkUrl.h"
#include "../commands/deleteUrl.h"
using namespace std;

// Constructor: initializes references to the filter and store
CommandParser::CommandParser(BloomFilter& filter, UrlStore& store)
    : filter(filter), store(store) {}

// Parses the incoming command and returns the appropriate response string
string CommandParser::Parse(const string& command) {
    string method, url, extra;
    istringstream iss(command);
    iss >> method >> url >> extra;

    // Reject command if missing parts or contains extra arguments
    if (method.empty() || url.empty() || !extra.empty()) {
        return "400 Bad Request\n";
    }

    // Check if the method is one of the supported commands
    if (method != "POST" && method != "GET" && method != "DELETE"){
        return "400 Bad Request\n";
    }

    // Validate the format of the URL
    if (!isValidUrl(url)){
        return "400 Bad Request\n";
    }

    // Handle POST command: add the URL to the blacklist
    if (method == "POST"){
        addUrl command(url, filter, store);
        command.execute();
        return "201 Created\n";
    }

    // Handle GET command: check the URL and return the result
    if (method == "GET"){
        checkUrl command(url, filter, store);
        command.execute(); 
        return "200 Ok\n\n" + command.getResult() + "\n";
    }

    // Handle DELETE command: try to remove the URL from the store
    if (method == "DELETE"){
        deleteUrl command(url, filter, store);
        if (!command.execute()){
            return "404 Not Found\n";
        }
        return "204 No Content\n";
    }
    // Fallback return in case something was missed
    return "400 Bad Request\n";
}

// Checks whether a given URL is in valid format using regex
bool CommandParser::isValidUrl(const string& url) {
    static const regex urlRegex(R"(^((https?:\/\/)?(www\.)?([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,})(\/\S*)?$)");
    return regex_match(url, urlRegex);
}
