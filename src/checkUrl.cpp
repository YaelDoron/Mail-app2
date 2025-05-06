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
    bool flag = true;
    for (int idx : indexes){
        if (!filter.isBitOn(idx)){
            flag = false;
        }
    }

    if(!flag){
        cout << "false" << endl; // Definitely not in the blacklist
    }
    else{
        // Might be in the blacklist, check actual store
        std::cout << (isInUrlStore() ? "true true" : "true false") << std::endl;
        }
    }
    
// Checks if the URL is explicitly listed in the store
bool checkUrl::isInUrlStore() const {
    return store.contains(url);
}
