#ifndef DELETE_URL_H
#define DELETE_URL_H

#include <string>
#include "BloomFilter.h"
#include "UrlStore.h"

class deleteUrl {
    std::string url;
    BloomFilter& filter;
    UrlStore& store;

public:
    deleteUrl(const std::string& url, BloomFilter& filter, UrlStore& store);
    bool execute(); // returns true if deletion succeeded
};

#endif
