#pragma once
#include <string>
#include <fstream>
#include "BloomFilter.h"
#include "Icommand.h"
#include "UrlStore.h"

// Class to add a URL to the Bloom Filter
class addUrl:public Icommand {
public:
    // Constructor to initialize URL, Bloom filter, and urlstore
    addUrl(const std::string& url, BloomFilter& filter, UrlStore& store);
    // Execute the command: add URL to Bloom filter
    void execute();
private:
    const std::string& url; // URL to be added to the filter
    BloomFilter& filter; // Bloom filter reference
    UrlStore& store;  // URL store for file + in-memory set
};