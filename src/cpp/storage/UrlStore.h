#ifndef URLSTORE_H
#define URLSTORE_H

#include <string>
#include <set>

class UrlStore {
private:
    std::set<std::string> urls;
    std::string filePath;

public:
    UrlStore(const std::string& filePath);

    void load();              // Loads all URLs from file into the set
    void save() const;        // Saves current set to file
    bool remove(const std::string& url);
    bool contains(const std::string& url) const;
    void add(const std::string& url);
};

#endif
