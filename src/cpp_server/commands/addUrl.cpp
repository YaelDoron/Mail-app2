
#include "addUrl.h"
#include <string>
#include <iostream>
#include <fstream>
#include "SaveToFilter.h"
using namespace std;

addUrl::addUrl(const std::string& url, BloomFilter& bf, UrlStore& store)
:url(url),filter(bf),store(store) {}

// Executes the add URL operation:
// 1. Adds the URL to the store (if not already present)
// 2. Saves the store to file
// 3. Sets the relevant bits in the Bloom filter
void addUrl::execute() {
    vector<int> indexes = filter.getIndexes(url);

    // Set each bit in the Bloom filter
    for (int idx : indexes){
        filter.setBit(idx);
    }

    // add the url to the urlstore
    store.add(url);
    SaveToFilter saver("data/bloom.txt", filter.getFilter());
    saver.execute();
}
