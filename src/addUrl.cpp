
#include "addUrl.h"
#include <string>
#include <iostream>
#include <fstream>
using namespace std;

addUrl::addUrl(const std::string& url, BloomFilter& bf, const std::string& file)
:url(url),filter(bf),file(file) {}

// Executes the add URL operation:
// 1. Sets the relevant bits in the Bloom filter
// 2. Appends the URL to the file
void addUrl::execute() {
    vector<int> indexes = filter.getIndexes(url);
    // Set each bit in the Bloom filter
    for (int idx : indexes){
        filter.setBit(idx);
    }

    // Open the file in append mode to add the URL without overwriting existing data
    std::ofstream file(this->file, std::ios::app); 
    if (file.is_open()) {
        file << url << "\n"; // write url followed by newline
        file.close();
    } else {
        // Print error if the file could not be opened
        std::cerr << "Failed to open urls.txt" << std::endl;
    }
}
