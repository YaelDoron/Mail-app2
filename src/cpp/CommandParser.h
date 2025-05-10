#ifndef COMMANDPARSER_H
#define COMMANDPARSER_H

#include "../storage/BloomFilter.h"
#include "../storage/UrlStore.h"
#include <string>

// Responsible for parsing and executing commands (POST, GET, DELETE)
class CommandParser {
public:
    // Constructor that receives references to the BloomFilter and UrlStore
    CommandParser(BloomFilter& filter, UrlStore& store);
    std::string Parse(const std::string& command);

private:
    BloomFilter& filter;
    UrlStore& store;
    bool isValidUrl(const std::string& url); // Checks whether a given URL is valid using regex
};

#endif

