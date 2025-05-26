#pragma once
#include <string>
#include <vector>
#include "Icommand.h"

// Class to save data from a vector into a file
class SaveToFilter : public Icommand { 
private:
    std::string file_name;
    std::vector<bool> array_bits;

public:
    SaveToFilter(const std::string& file_name, const std::vector<bool>& array_bits);
    // Execute the command: save the data from the vector to the file
    void execute();
};