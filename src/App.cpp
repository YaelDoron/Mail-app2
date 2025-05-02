#include "App.h"
#include "BloomFilter.h"      
#include "addUrl.h"           
#include "checkUrl.h"         
#include "LoadFromFilter.h"   
#include "SaveToFilter.h" 
#include <regex>
#include <sstream>
#include <iostream>

using namespace std;    

App::App() : filter(nullptr), urlFilePath("/usr/src/mytest/data/urls.txt"), bloomFilePath("/usr/src/mytest/data/bloom.txt"){}

bool App::isValidUrl(const string& url) {
    static const regex urlRegex(R"(^((https?:\/\/)?(www\.)?([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,})(\/\S*)?$)");
    return regex_match(url, urlRegex);
}

// Parses the initialization line and initializes the Bloom filter 
// with the given size and repetition values
bool App::initializeFilter(const string& line) {
    istringstream iss(line);
    int size;
    vector<int> reps;
    int temp;

    if (!(iss >> size)) return false;
    while (iss >> temp) {
        reps.push_back(temp);
    }

    hash<string> hasher;
    try {
        filter = make_unique<BloomFilter>(size, reps, hasher);
    } catch (const invalid_argument& e) {
        return false;
    }

    return true;
}

void App::handleCommand(const string& line) {
    istringstream iss(line);
    int commandType;
    string url;
    
    // invalid command format
    if (!(iss >> commandType >> url)) {
        return;
    }

    if (!isValidUrl(url)) {
        return;
    }

    if (commandType == 1) {
        addUrl command(url, *filter, urlFilePath);
        command.execute();
    } else if (commandType == 2) {
        checkUrl command(url, *filter, urlFilePath);
        command.execute();
    } else {
        return;
    }

    SaveToFilter saver(bloomFilePath, filter->getFilter());
    saver.execute();
}

void App::run() {
    string initLine;
    while (true) {
        getline(cin, initLine);
        if (initializeFilter(initLine)) break;
    }

    // Try loading saved Bloom filter if exists
    vector<bool> loadedBits;
    LoadFromFilter loader(bloomFilePath, loadedBits);
    loader.execute();
    if (loadedBits.size() > 0) {
        filter->setFilter(loadedBits);
    }
    
    string commandLine;
    while (getline(cin, commandLine)) {
        handleCommand(commandLine);
    }
}
