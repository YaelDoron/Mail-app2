#include <fstream>
#include <filesystem>
#include <iostream>
#include "SaveToFilter.h"

// Constructor that gets the name of the file and a vector.  
//saving the name of the file in the parameter file_name and the vector in the parameter array_bits
SaveToFilter::SaveToFilter(const std::string& file_name, const std::vector<bool>& array_bits)
    : file_name(file_name), array_bits(array_bits) {}

void SaveToFilter::execute() {
    std::filesystem::create_directory("data"); // Creating the data folder if it does not exist
    std::ofstream out(file_name); //opening the file to write the bits

    // Add check for file open success
    if (!out.is_open()) {
        std::cerr << "[ERROR] Failed to open file for writing: " << file_name << std::endl;
        return;
    }

    for (bool bit : array_bits) { //untill the end of the vector we writ 1 and 0 accoarding to the vector
        out << (bit ? '1' : '0');
    }

    out.close();

      
    // Verify file was written correctly
    std::ifstream verify(file_name);
    std::string content((std::istreambuf_iterator<char>(verify)), std::istreambuf_iterator<char>());
    std::cout << "[DEBUG] Saved " << content.length() << " bits to " << file_name << std::endl;
}