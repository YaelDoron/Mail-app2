#include <gtest/gtest.h>
#include "deleteUrl.h"
#include "BloomFilter.h"

#include <fstream>
#include <algorithm>
#include <filesystem>

using namespace std;

TEST(DeleteUrlTest, isUrlDeleted){
    string testFile = "../data/test_urls.txt";
    filesystem::create_directory("../data");

    // Ensure the file is empty before starting
    ofstream clear(testFile, ios::trunc);
    clear.close();

    BloomFilter bf(8, {1}, hash<string>());
    UrlStore store(testFile);
    store.load();

    string url = "www.unit-test.com";
    string url2 = "www.unit-test2.com";

    // Pre-populate the file with two URLs
    ofstream outfile(testFile);
    outfile << url << endl;
    outfile << url2 << endl;
    outfile.close();
    store.load();  // Load updated file content into memory

    deleteUrl del(url, bf, store);
    bool result = del.execute();
    EXPECT_TRUE(result);

    // Check that the URL was removed from the file
    ifstream infile(testFile);
    string line;
    bool found = false;
    while (getline(infile, line)) {
        if (line == url) {
            found = true;
            break;
        }
    }
    infile.close();
    ASSERT_FALSE(found);

    // Check that the URL was also removed from the in-memory set
    EXPECT_FALSE(store.contains(url));

    std::remove(testFile.c_str());
}


TEST(DeleteUrlTest, UrlNotFoundInFileReturnsFalse){
    string testFile = "../data/test_urls.txt";
    filesystem::create_directory("../data");

    // Create and clear file
    ofstream clear(testFile, ios::trunc);
    clear.close();

    BloomFilter bf(8, {1}, hash<string>());
    UrlStore store(testFile);

    string url = "www.unit-test.com";
    string url2 = "www.unit-test2.com";

    // add url2 only
    ofstream outfile(testFile);
    outfile << url2 << endl;
    outfile.close();
    store.load();

    deleteUrl del(url, bf, store);
    bool result = del.execute();

    EXPECT_FALSE(result);
    EXPECT_TRUE(store.contains(url2));   // url2 should still be there
    EXPECT_FALSE(store.contains(url));   // url should not have been found

    std::remove(testFile.c_str());
}


TEST(DeleteUrlTest, deleteFromEmptyFileReturnsFalse){
    string testFile = "../data/test_urls.txt";
    filesystem::create_directory("../data");

    // Ensure the file is empty
    ofstream clear(testFile, ios::trunc);
    clear.close();

    string url = "www.unit-test.com";
    BloomFilter bf(8, {1}, hash<string>());
    UrlStore store(testFile);
    store.load();  // will be empty

    deleteUrl del(url, bf, store);
    bool result = del.execute();

    EXPECT_FALSE(result);                 // deletion should fail
    EXPECT_FALSE(store.contains(url));    // store should still not contain the url

    std::remove(testFile.c_str());
}