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

private:
    std::string url;
    const BloomFilter& filter;
    const UrlStore& store;

    // Check if the URL exists in the file
    bool isInUrlStore() const;
};
