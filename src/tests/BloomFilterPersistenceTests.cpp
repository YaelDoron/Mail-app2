#include <gtest/gtest.h>
#include "SaveToFilter.h"
#include "LoadFromFilter.h"
# include <filesystem>
#include <vector>
#include <fstream>
#include <string>
using namespace std;

// Function that deletes the temporary file (we call it at the end of every test)
void removeFile(const  std::string& filename) {
    std::filesystem::remove(filename);
}

// Testing the save to filter function correctly saved the Bloom Filter to a file
TEST(BloomFilterPersistenceTests, SaveAndLoadTest) {
    std::string filename = "data/saving_vector_test.txt"; // creating temporary file
    std::filesystem::create_directory("data"); // creating Data folder if it does not exists already
    std::vector<bool> array_bits = {1, 0, 0, 0};
    std::vector<bool> loaded_vector; // empty vector to check that the saving is done sucssessfully

    SaveToFilter save(filename, array_bits); // saving the vector to the temporary file
    save.execute(); 

    LoadFromFilter load(filename, loaded_vector); // loading from the temporary file to output
    load.execute(); 

    EXPECT_EQ(array_bits, loaded_vector); // makimg sure the original vector and the loaded vector are equal
    removeFile(filename);
}

// If the file is empty, the load from filter function should return empty vector
TEST(BloomFilterPersistenceTests, LoadEmptyFileReturnsEmpty) {
    std::string filename = "data/empty_file.txt";
    std::filesystem::create_directory("data"); // creating Data folder if it does not exists already

    ofstream out(filename); // creating empty file
    out.close();
    std::vector<bool> loaded_vector;

    LoadFromFilter load(filename, loaded_vector);
    load.execute();

    EXPECT_TRUE(loaded_vector.empty());
    removeFile(filename);
}


// If the file does not exist,  load from filter function should return empty vector
TEST(BloomFilterPersistenceTests, LoadNonExistentFile) {
    std::string filename = "data/non_existent_file_test.txt";
    std::filesystem::create_directory("data"); // creating Data folder if it does not exists already
    std::vector<bool> loaded_vector;

    LoadFromFilter load(filename, loaded_vector);
    load.execute();

    EXPECT_TRUE(loaded_vector.empty()); // returning empty vector
}

