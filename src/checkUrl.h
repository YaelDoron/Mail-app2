#pragma once
#include "BloomFilter.h"
#include "Icommand.h"
#include <string>

// Class to check if a URL is blacklisted in the Bloom filter
class checkUrl : public Icommand {
public:
    checkUrl(const std::string& url, BloomFilter& filter, const std::string& file);
    void execute() override;

private:
    std::string url;
    const BloomFilter& filter;
    const std::string file;

    // Check if the URL exists in the file
    bool isInUrlFile();
};
