#include "BloomFilter.h"
#include "../RepeatableHashFunction.h"
#include <iostream>
using namespace std;

BloomFilter::BloomFilter(int size, const vector<int>& repetitions, std::function<std::size_t(const std::string&)> hashFunc)
    : filter(size, false), hashRep(repetitions), hashFunc(hashFunc) {
    // Check if size is valid
    if (size <= 0) {
        throw invalid_argument("BloomFilter size must be greater than 0.");
    }
    
    //Initialize the filter
    filter = vector<bool>(size, false); 

    // Check if repetitions vector is empty
    if (repetitions.empty()) {
        throw invalid_argument("Repetitions vector is empty. No hash functions created.");
    }
    
    // Ensure all repetition counts are valid
    for (int rep : repetitions) {
        if (rep <= 0) {
            throw std::invalid_argument("All repetition counts must be greater than 0.");
        }
    }

    //Initialize the remaining fields
    hashRep = repetitions; 

}

void BloomFilter::setBit(int index) {
    //Set the bit at the specified index to true
    filter[index] = true; 
}

bool BloomFilter::isBitOn(int index) const {
    //Return whether the bit at the index is true
    return filter[index] == true; 
}

vector<int> BloomFilter::getIndexes(const string& Url) const {
    vector<int> indexes;
    std::cout << "[DEBUG - BloomFilter] Getting indexes for URL: " << Url << std::endl;
    std::cout << "[DEBUG - BloomFilter] Using " << hashRep.size() << " hash functions" << std::endl;
    
    for (int rep : hashRep) {
        // Create hash function with repetitions add hash the URL
        RepeatableHashFunction rhf(rep, hashFunc); 
        size_t hashedValue = rhf.hash(Url); 
        // Map the hash to the filter size and store the index
        int index = hashedValue % filter.size(); 
        indexes.push_back(index);
        std::cout << "[DEBUG - BloomFilter] Hash(" << rep << "): " << hashedValue << " -> index " << index << std::endl;
    }
    return indexes;  
}

const vector<bool>& BloomFilter::getFilter() const {
    return filter; 
}


const vector<int>& BloomFilter::gethashRep() const {
    return hashRep; 
}

void BloomFilter::setFilter(const vector <bool>& newFilter){
    if (newFilter.size() == filter.size()){
        filter = newFilter;
    } 
    else{
        cerr << "Loaded filter size does not match initialized filter size." << endl; 
    }
}

