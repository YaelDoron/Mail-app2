#include <gtest/gtest.h>
#include "BloomFilter.h"
#include "UrlStore.h"
#include "addUrl.h"
#include "CommandParser.h"
#include <fstream>
#include <algorithm>
#include <filesystem>
#include <string>
using namespace std;

// Test that POST on a new URL returns 201 Created
TEST(CommandParserTest, PostReturns201){
    const std::string testFile = "../data/test_urls.txt";
    std::filesystem::create_directory("../data");
    std::ofstream clear(testFile, std::ios::trunc); // Clear previous data
    clear.close();

    BloomFilter bf(8, {1}, std::hash<std::string>());
    UrlStore store(testFile);
    store.load();

    CommandParser parser(bf, store);
    string response = parser.Parse("POST www.unit-test.com");
    EXPECT_EQ(response, "201 Created");
}

// Test that DELETE on an existing URL returns 204 No Content
TEST (CommandParserTest, DeleteReturns204){
    const std::string testFile = "../data/test_urls.txt";
    std::filesystem::create_directory("../data");
    std::ofstream clear(testFile, std::ios::trunc);
    clear.close();

    BloomFilter bf(8, {1}, std::hash<std::string>());
    UrlStore store(testFile);
    store.load();
    string url = "www.unit-test.com";
    addUrl add(url,bf,store);
    add.execute();       // Add URL before trying to delete
    CommandParser parser(bf, store);
    string response = parser.Parse("DELETE www.unit-test.com");
    EXPECT_EQ(response, "204 No Content");
}

// Test that GET on an existing URL returns 200 OK
TEST (CommandParserTest, GetReturns200){
    const std::string testFile = "../data/test_urls.txt";
    std::filesystem::create_directory("../data");
    std::ofstream clear(testFile, std::ios::trunc);
    clear.close();

    BloomFilter bf(8, {1}, std::hash<std::string>());
    UrlStore store(testFile);
    store.load();
    string url = "www.unit-test.com";
    addUrl add(url,bf,store);
    add.execute();       // Add URL before checking

    CommandParser parser(bf,store);
    string response = parser.Parse("GET www.unit-test.com");
    EXPECT_EQ(response, "200 Ok\n\ntrue true");   
}

// Test that an unknown command returns 400 Bad Request
TEST (CommandParserTest, illegalCommandReturns400){
    const std::string testFile = "../data/test_urls.txt";
    std::filesystem::create_directory("../data");
    std::ofstream clear(testFile, std::ios::trunc);
    clear.close();

    BloomFilter bf(8, {1}, std::hash<std::string>());
    UrlStore store(testFile);
    store.load();

    CommandParser parser(bf, store);
    string response = parser.Parse("CHANGE www.unit-test.com");
    EXPECT_EQ(response, "400 Bad Request");
}

// Test that a syntactically correct but invalid URL returns 400 Bad Request
TEST (CommandParserTest, illegalUrlReturns400){
    const std::string testFile = "../data/test_urls.txt";
    std::filesystem::create_directory("../data");
    std::ofstream clear(testFile, std::ios::trunc);
    clear.close();

    BloomFilter bf(8, {1}, std::hash<std::string>());
    UrlStore store(testFile);
    store.load();

    CommandParser parser(bf, store);
    string response = parser.Parse("POST htp:/google.com");
    EXPECT_EQ(response, "400 Bad Request");
}

// Test that DELETE on a non-existing URL returns 404 Not Found
TEST (CommandParserTest, Delete_Test_UrlNotFoundReturns404){
    const std::string testFile = "../data/test_urls.txt";
    std::filesystem::create_directory("../data");
    std::ofstream clear(testFile, std::ios::trunc);
    clear.close();

    BloomFilter bf(8, {1}, std::hash<std::string>());
    UrlStore store(testFile);
    store.load();
    CommandParser parser(bf, store);
    string response = parser.Parse("DELETE www.unit-test.com");
    EXPECT_EQ(response, "404 Not Found");
}