#ifndef REPEATABLE_HASH_FUNCTION_H
#define REPEATABLE_HASH_FUNCTION_H

#include <functional>
#include <string>

// This class represents a hash function that can be applied multiple times
class RepeatableHashFunction {
private:
    // Number of times to apply the hash function
    int repetitions; 
    // Initialize the hash function
    std::function<std::size_t(const std::string&)> hashFunc; 

public:
    // Constructor
    RepeatableHashFunction(int repetitions, std::function<std::size_t(const std::string&)> hashFunc);

    // Applies the hash function to the given URL the specified number of times
    std::size_t hash(const std::string& Url) const;
};

#endif 

