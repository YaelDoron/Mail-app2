#include <gtest/gtest.h>
#include "checkUrl.h"
#include "addUrl.h"
#include "BloomFilter.h"
#include "UrlStore.h"

#include <fstream>
#include <algorithm>
#include <filesystem>
#include <sstream>

using namespace std;

// Test 1: One bit is off --> should print "false"
TEST(CheckUrlTest, BitOff_PrintsFalse) {
    BloomFilter bf(8, {1}, std::hash<string>());
    string url = "www.example.com";
    UrlStore store("../data/test_urls.txt");
    store.load();  // מומלץ לטעון לפני כל שימוש

    checkUrl check(url, bf, store);

    std::stringstream buffer;
    std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());

    check.execute();

    std::cout.rdbuf(old);
    EXPECT_EQ(buffer.str(), "false\n");
}

// Test 2: All bits are on, but the URL is not in the file --> should print "true false"
TEST(CheckUrlTest, BitsOn_ButUrlNotInFile_PrintsTrueFalse) {
    const std::string testFile = "../data/test_urls.txt";
    std::filesystem::create_directory("../data");

    std::string url = "www.example.com";
    BloomFilter bf(8, {1}, std::hash<std::string>());

    UrlStore store(testFile);
    store.load();

    // Add URL – turns on the bits and adds to store
    addUrl add(url, bf, store);
    add.execute();

    // Clear the file manually to simulate "missing" URL in file
    std::ofstream clear(testFile, std::ios::trunc);
    clear.close();
    store.load();  // חשוב לטעון מחדש את store (הקובץ עכשיו ריק)

    checkUrl check(url, bf, store);

    std::stringstream buffer;
    std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());

    check.execute();

    std::cout.rdbuf(old);
    EXPECT_EQ(buffer.str(), "true false\n");

    std::remove(testFile.c_str());
}

// Test 3: All bits are on, and the URL is in the file --> should print "true true"
TEST(CheckUrlTest, BitsOn_AndUrlInFile_PrintsTrueTrue) {
    const string testFile = "../data/test_urls.txt";
    std::filesystem::create_directory("../data");

    std::string url = "www.added-by-addurl.com";
    BloomFilter bf(8, {1}, std::hash<std::string>());

    UrlStore store(testFile);
    store.load();

    addUrl add(url, bf, store);
    add.execute();

    checkUrl check(url, bf, store);

    std::stringstream buffer;
    std::streambuf* old = std::cout.rdbuf(buffer.rdbuf());

    check.execute();

    std::cout.rdbuf(old);
    EXPECT_EQ(buffer.str(), "true true\n");

    std::remove(testFile.c_str());
}
