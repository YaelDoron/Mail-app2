#include <gtest/gtest.h>
#include "addUrl.h"
#include "BloomFilter.h"

#include <fstream>
#include <algorithm>
#include <filesystem>



using namespace std;

//tests if add_url adds the url to the blacklist text file
TEST(AddUrlTest, UrlIsSavedToFile) {
    const std::string testFile = "../data/test_urls.txt";

    // making sure data folfer exists
    std::filesystem::create_directory("../data");

    // making sure the file is empty
    std::ofstream clear(testFile, std::ios::trunc);
    clear.close();

    BloomFilter bf(8, {1}, std::hash<std::string>());
    std::string url = "www.unit-test.com";

    addUrl add(url, bf, testFile);
    add.execute();

    std::ifstream file(testFile);
    ASSERT_TRUE(file.is_open());

    std::string line;
    getline(file, line);
    EXPECT_EQ(line, url);

    file.close();
    std::remove(testFile.c_str());  
}


//tests that the correct bits in the bloom filter are set
TEST(AddUrlTest, BitsAreSetInBloomFilter) {
    const std::string testFile = "../data/test_urls.txt";
    std::filesystem::create_directory("../data");
    BloomFilter bf(8, {1}, std::hash<string>());
    string url = "www.example.com";
    addUrl add(url, bf, testFile);  
    add.execute();

    vector<int> indexes = bf.getIndexes({url});
    const auto& filter = bf.getFilter();

    for (int idx : indexes) {
        EXPECT_TRUE(filter[idx]) << "Expected filter[" << idx << "] to be true";
    }

    std::remove(testFile.c_str());  // clearing the file
}


//tests that only the relevant bits are set (all other bits should be false)
TEST(AddUrlTest, OnlyRelevantBitsAreSetInFilter) {
    const std::string testFile = "../data/test_urls.txt";

    std::filesystem::create_directory("../data");

    BloomFilter bf(8, {1, 2}, std::hash<string>());
    string url = "www.example.com";

    addUrl add(url, bf, testFile);
    add.execute();

    vector<int> expectedIndexes = bf.getIndexes({url});
    const auto& filter = bf.getFilter();

    for (int i = 0; i < filter.size(); ++i) {
        if (std::find(expectedIndexes.begin(), expectedIndexes.end(), i) != expectedIndexes.end()) {
            EXPECT_TRUE(filter[i]) << "Expected bit at index " << i << " to be set.";
        } else {
            EXPECT_FALSE(filter[i]) << "Bit at index " << i << " should NOT be set.";
        }
    }

    std::remove(testFile.c_str());  
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}