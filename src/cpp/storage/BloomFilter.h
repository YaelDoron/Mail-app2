#ifndef BLOOMFILTER_H
#define BLOOMFILTER_H

#include <vector>
#include <string>
#include <memory>
#include <functional>
#include "RepeatableHashFunction.h"

// BloomFilter class definition
class BloomFilter {
private:
    std::vector<bool> filter; //Bit array for the filter
    std::vector<int> hashRep; // Hash repetitions for the Bloom filter
    std::function<std::size_t(const std::string&)> hashFunc; //Customizable hash function

public:
    // Constructor: Initializes the Bloom filter with size, repetitions, and hash function
    BloomFilter(int size, const std::vector<int>& repetitions, std::function<std::size_t(const std::string&)> hashFunc);

    // Set a bit in the filter at the specified index
    void setBit(int index); 
    
    //Check if the bit at the specified index is set to true
    bool isBitOn(int index) const;
    
    // Generate a vector of hash indices for a given URL
    std::vector<int> getIndexes(const std::string& Url) const;

    //Get the current filter state
    const std::vector<bool>& getFilter() const;

    // Get the hash repetitions used in the Bloom filter
    const std::vector<int>& gethashRep() const;

    void setFilter(const std::vector<bool>& newFilter);

};

#endif // BLOOMFILTER_H

