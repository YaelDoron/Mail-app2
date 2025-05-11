#include "LoadFromFilter.h"
#include <fstream>
#include <filesystem>
#include <iostream>


// Constructor that gets the name of the file and a vector.  
//saving the name of the file in the parameter file_name and the loaded vector in the parameter loaded_vector
LoadFromFilter::LoadFromFilter(const std::string& file_name, std::vector<bool>& loaded_vector)
    : file_name(file_name), loaded_vector(loaded_vector) {}

void LoadFromFilter::execute() { // overriding the execute function from the Icommand interface
    std::filesystem::create_directory("data"); // Creating the data folder if it does not exist
    std::ifstream in(file_name);
    loaded_vector.clear(); //clearing the vector
    char c;
    //If the char is 1 we push true, else we push false
    while (in >> c) {
        if (c == '1') loaded_vector.push_back(true);
        else if (c == '0') loaded_vector.push_back(false);
    }
    // DEBUG: הצגת האינדקסים שנטענו כ-true מהקובץ
    std::cout << "[DEBUG - LoadFromFilter] Loaded bits: ";
    for (size_t i = 0; i < loaded_vector.size(); ++i) {
        if (loaded_vector[i]) std::cout << i << " ";
    }
    std::cout << std::endl;
}