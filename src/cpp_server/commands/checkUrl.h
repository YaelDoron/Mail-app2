#pragma once
#include "BloomFilter.h"
#include "Icommand.h"
#include "UrlStore.h"
#include <string>

// Class to check if a URL is blacklisted in the Bloom filter
class checkUrl : public Icommand {
public:
    checkUrl(const std::string& url, BloomFilter& filter, const UrlStore& store);
    void execute() override;
    std::string getResult() const;

private:
    std::string url;
    BloomFilter& filter;
    const UrlStore& store;
    std::string result;

    // Check if the URL exists in the file
    bool isInUrlStore() const;
};
