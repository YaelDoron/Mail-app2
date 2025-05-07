#ifndef COMMANDPARSER_H
#define COMMANDPARSER_H

#include "BloomFilter.h"
#include "UrlStore.h"
#include <string>

class CommandParser {
public:
    CommandParser(BloomFilter& filter, UrlStore& store);

    std::string Parse(const std::string& command);

private:
    BloomFilter& filter;
    UrlStore& store;
};

#endif