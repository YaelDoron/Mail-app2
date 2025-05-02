#pragma once
#include <string>
#include <fstream>
#include "BloomFilter.h"
#include "Icommand.h"

// Class to add a URL to the Bloom Filter
class addUrl:public Icommand {
public:
    // Constructor to initialize URL, Bloom filter, and file path
    addUrl(const std::string& url, BloomFilter& filter, const std::string& file);
    // Execute the command: add URL to Bloom filter
    void execute();
private:
    const std::string& url; // URL to be added to the filter
    BloomFilter& filter; // Bloom filter reference
    const std::string& file; // File to persist the filter and URL list
};