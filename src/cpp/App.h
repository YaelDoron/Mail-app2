#pragma once
#include <map>
#include "Icommand.h"
#include "BloomFilter.h"
#include <memory>
#include <string>
#include "UrlStore.h"
using namespace std;

// Main application class to handle URL filtering operations
class App
{
private:
    unique_ptr<BloomFilter> filter;
    UrlStore store;
    string bloomFilePath;

    // Initialize the Bloom filter from the given line
    bool initializeFilter(const string& line);

    // Handle a command from the user (add URL, check URL, etc.)
    void handleCommand(const string& line);

    // Validate the format of a given URL
    bool isValidUrl(const string& url);

public:
    App();
    void run();
};
