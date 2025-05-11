
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

    // DEBUG: הדפסת האינדקסים שצריך להדליק
    cout << "[DEBUG - addUrl] Indexes to set: ";
    for (int i : indexes) cout << i << " ";
    cout << endl;

    // Set each bit in the Bloom filter
    for (int idx : indexes){
        filter.setBit(idx);
    }

     // DEBUG: הדפסת הביטים שדלקו אחרי ההוספה
     cout << "[DEBUG - addUrl] Bits after setBit: ";
     const vector<bool>& bits = filter.getFilter();
     for (size_t i = 0; i < bits.size(); ++i) {
         if (bits[i]) cout << i << " ";
     }
     cout << endl;
 
    // add the url to the urlstore
    store.add(url);
    SaveToFilter saver("data/bloom.txt", filter.getFilter());
    saver.execute();
}
