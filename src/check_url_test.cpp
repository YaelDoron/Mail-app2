#include <gtest/gtest.h>
#include "checkUrl.h"
#include "BloomFilter.h"
#include "addUrl.h"

#include <fstream>
#include <algorithm>
#include <filesystem>


using namespace std;

//Test 1: One bit is off --> should print "false"
TEST(CheckUrlTest, BitOff_PrintsFalse) {
    BloomFilter bf(8, {1}, std::hash<string>());
    string url = "www.example.com";  // No bits are on

    checkUrl check(url, bf, "../data/test_urls.txt");

    std::stringstream buffer;
    std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());

    check.execute();

    std::cout.rdbuf(old);
    EXPECT_EQ(buffer.str(), "false\n");
}

//Test 2: All bits are on, but the URL is not in the file --> should print "true false"
TEST(CheckUrlTest, BitsOn_ButUrlNotInFile_PrintsTrueFalse) {
    const std::string testFile = "../data/test_urls.txt";
    std::filesystem::create_directory("../data");
    std::string url = "www.example.com";

    BloomFilter bf(8, {1}, std::hash<std::string>());

    //Add URL using AddUrl – turns on the bits and writes to the file
    addUrl add(url, bf, testFile);
    add.execute();

    //Clear the file to remove the URL
    std::ofstream clear(testFile, std::ios::trunc);  
    clear.close();

    //CheckUrl finds bits on but the URL is no longer in the file
    checkUrl check(url, bf, testFile);

    std::stringstream buffer;
    std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());

    check.execute();

    std::cout.rdbuf(old);
    EXPECT_EQ(buffer.str(), "true false\n");

    std::remove(testFile.c_str());
}

//Test 3: All bits are on, and the URL is in the file --> should print "true true"
TEST(CheckUrlTest, BitsOn_AndUrlInFile_PrintsTrueTrue) {
    const string testFile = "../data/test_urls.txt";
    std::filesystem::create_directory("../data");
    std::string url = "www.added-by-addurl.com";

    BloomFilter bf(8, {1}, std::hash<std::string>());

    addUrl add(url, bf, testFile);
    add.execute();

    checkUrl check(url, bf, testFile);

    std::stringstream buffer;
    std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());

    check.execute();

    std::cout.rdbuf(old);
    EXPECT_EQ(buffer.str(), "true true\n");

    std::remove(testFile.c_str());
}





