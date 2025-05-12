#include "deleteUrl.h"

deleteUrl::deleteUrl(const std::string& url, BloomFilter& filter, UrlStore& store)
    : url(url), filter(filter), store(store) {}
    
// Attempts to remove the URL from the UrlStore. Returns true if successful.
bool deleteUrl::execute() {
    return store.remove(url);
}
