#include "BloomFilter.h"
#include "checkUrl.h"
#include <string>
#include <iostream>
#include <fstream>
using namespace std;

checkUrl::checkUrl(const std::string& url, BloomFilter& filter, const std::string& file)
    : url(url), filter(filter), file(file) {}

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
        // Might be in the blacklist, check actual file
        cout << (isInUrlFile() ? "true true" : "true false") << endl;
        }
    }
    
// Checks if the URL is explicitly listed in the file
bool checkUrl::isInUrlFile(){
    ifstream infile(file);
    string line;
    while (getline(infile, line)) {
        if (line == url) {
            return true;
        }
    }
    return false;
}
