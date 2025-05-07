#include "CommandParser.h"

CommandParser::CommandParser(BloomFilter& filter, UrlStore& store)
    : filter(filter), store(store) {}

std::string CommandParser::Parse(const std::string& command) {
    // Empty implementation - all tests should fail
    return "";
}
