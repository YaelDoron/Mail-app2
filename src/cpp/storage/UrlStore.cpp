#include "UrlStore.h"
#include <fstream>
#include <iostream>
using namespace std;

UrlStore::UrlStore(const string& filePath) : filePath(filePath) {}

// Loads all URLs from file into set
void UrlStore::load() {
    urls.clear();
    ifstream in(filePath);
    string line;

    while (getline(in, line)) {
        if (!line.empty()) {
            urls.insert(line);
        }
    }

    in.close();
}

// Saves the set back into the file (one URL per line)
void UrlStore::save() const {
    ofstream out(filePath, ios::trunc);
    for (const auto& url : urls) {
        out << url << "\n";
    }
    out.close();
}

bool UrlStore::contains(const string& url) const {
    return urls.find(url) != urls.end();
}


void UrlStore::add(const string& url) {
    urls.insert(url);
    save();
}

bool UrlStore::remove(const std::string& url) {
    if (urls.erase(url)) { // removes the url if it's in urlstore
        save(); // overwrite the file with updated set
        return true;
    }
    return false;
}

