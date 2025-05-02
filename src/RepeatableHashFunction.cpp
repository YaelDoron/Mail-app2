#include "RepeatableHashFunction.h"

//Constructor
RepeatableHashFunction::RepeatableHashFunction(int repetitions, std::function<std::size_t(const std::string&)> hashFunc)
 : repetitions(repetitions), hashFunc(hashFunc) {
}


//Applies the hash function to the input URL multiple times
std::size_t RepeatableHashFunction::hash(const std::string& Url) const {
    //First application of the hash function to the original URL
    std::size_t result = hashFunc(Url);
    //Apply the hash function repeatedly on the result converted to a string
    for (int i = 1; i < repetitions; ++i) {
        std::string asString = std::to_string(result);
        result = hashFunc(asString);
    }
    //Return the final result after all repetitions
    return result;
}