#include "BloomFilter.h"
#include "checkUrl.h"
#include <string>
#include <iostream>
#include <fstream>
using namespace std;

checkUrl::checkUrl(const string& url, BloomFilter& filter, const UrlStore& store)
    : url(url), filter(filter), store(store) {}

// Executes the check: determines if the URL might exist and whether it actually exists in the file
void checkUrl::execute() {
    vector <int> indexes = filter.getIndexes(url);
    cout << "[GET] Indexes for URL: ";
    for (int i : indexes) cout << i << " ";
        std::cout << std::endl;

    for (int idx : indexes) {
        cout << "[GET] Bit at index " << idx << " = " << (filter.isBitOn(idx) ? "ON" : "OFF") << endl;
    }
    bool flag = true;
    for (int idx : indexes){
        if (!filter.isBitOn(idx)){
            flag = false;
        }
    }

    if(!flag){
        result = "false"; // Definitely not in the blacklist
    }
    else{
        // Might be in the blacklist, check actual store
        result = isInUrlStore() ? "true true" : "true false";
        }
}
    
// Checks if the URL is explicitly listed in the store
bool checkUrl::isInUrlStore() const {
    return store.contains(url);
}

// Returns the result of the URL check ("true true", "true false", "false")
string checkUrl::getResult() const {
    return result;
}
