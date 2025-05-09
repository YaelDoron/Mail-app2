#pragma once
#include <string>
#include <vector>
#include "Icommand.h"

// Class to load data from a file into a vector
class LoadFromFilter : public Icommand { 
private:
    std::string file_name;
    std::vector<bool>& loaded_vector;

public:
    LoadFromFilter(const std::string& file_name, std::vector<bool>& loaded_vector);
    // Execute the command: load the data from the file into the vector
    void execute();
};