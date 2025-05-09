#include "deleteUrl.h"

deleteUrl::deleteUrl(const std::string& url, BloomFilter& filter, UrlStore& store)
    : url(url), filter(filter), store(store) {}

bool deleteUrl::execute() {
    return store.remove(url);
}
