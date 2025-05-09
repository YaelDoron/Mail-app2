#include "BloomFilter.h"
#include <gtest/gtest.h>
#include <functional>
#include <string>
#include <algorithm>

using namespace std;

// Verifies correct initialization of BloomFilter, including filter size, repetitions and bit states.
TEST(BloomFilterTest, InitializationCheck) {
    std::hash<std::string> stdHash;
    BloomFilter bf(10, {3, 5}, stdHash);

    EXPECT_EQ(bf.getFilter().size(), 10);  
    EXPECT_EQ(bf.gethashRep().size(), 2);    
    // Check if all the bits in BloomFilter are 0 
    EXPECT_EQ(std::count(bf.getFilter().begin(), bf.getFilter().end(), true), 0);  
}

// Verifies that an exception is thrown when an invalid filter size is given.
TEST(BloomFilterTest, InvalidSize) {
    std::hash<std::string> stdHash;
    EXPECT_THROW(BloomFilter bf(0, {3, 5}, stdHash), std::invalid_argument);
}

// Verifies that an exception is thrown when the repetitions vector is empty.
TEST(BloomFilterTest, EmptyRepetitions) {
    std::hash<std::string> stdHash;
    EXPECT_THROW(BloomFilter bf(10, {}, stdHash), std::invalid_argument);
}

// Verifies that an exception is thrown when a negative repetition value is provided.
TEST(BloomFilterTest, NegativeRepetition) {
    std::hash<std::string> stdHash;
    EXPECT_THROW(BloomFilter bf(10, {-1, 5}, stdHash), std::invalid_argument);
}

// Verifies that an exception is thrown when a repetition value is zero.
TEST(BloomFilterTest, ZeroRepetition) {
    std::hash<std::string> stdHash;
    EXPECT_THROW(BloomFilter bf(10, {0, 5}, stdHash), std::invalid_argument);
}

// Verifies that the setBit function correctly sets a bit at a given index.
TEST(BloomFilterTest, SetBit) {
    std::hash<std::string> stdHash;
    BloomFilter bf(10, {3, 5}, stdHash);

    bf.setBit(5);

    EXPECT_TRUE(bf.isBitOn(5)); 
}

// Verifies that the isBitOn function correctly checks the status of a bit.
TEST(BloomFilterTest, IsBitOn) {
    std::hash<std::string> stdHash;
    BloomFilter bf(10, {3, 5}, stdHash);

    EXPECT_FALSE(bf.isBitOn(7));

    bf.setBit(7);

    EXPECT_TRUE(bf.isBitOn(7));
}

// Tests getIndexes with one repetition value
TEST(BloomFilterTest, GetIndexesTest_SingleRepetition) {
    std::hash<std::string> stdHash;

    BloomFilter bf1(10, {3}, stdHash);
    BloomFilter bf2(10, {3}, stdHash);
    
    string testUrl = "test_url1";

    // Same input should produce same indexes
    EXPECT_EQ(bf1.getIndexes(testUrl), bf2.getIndexes(testUrl));
    
    // Should return 1 index (1 repetition value)
    EXPECT_EQ(bf1.getIndexes(testUrl).size(), 1);

    // Index should be in [0, 9]
    for (int index : bf1.getIndexes(testUrl)) {
        EXPECT_GE(index, 0);
        EXPECT_LT(index, 10);
    }
}

// Tests getIndexes with two repetition values and small filter
TEST(BloomFilterTest, GetIndexesTest_TwoRepetitions_SmallFilter) {
    std::hash<std::string> stdHash;

    BloomFilter bf1(2, {3, 1}, stdHash);
    BloomFilter bf2(2, {3, 1}, stdHash);
    
    string testUrl = "test_url2";

    // Same input should produce same indexes
    EXPECT_EQ(bf1.getIndexes(testUrl), bf2.getIndexes(testUrl));
    
    // Should return 2 indexes
    EXPECT_EQ(bf1.getIndexes(testUrl).size(), 2);

    // Indexes should be in [0, 1]
    for (int index : bf1.getIndexes(testUrl)) {
        EXPECT_GE(index, 0);
        EXPECT_LT(index, 2);
    }
}

// Tests getIndexes with multiple repetition values
TEST(BloomFilterTest, GetIndexesTest_MultipleRepetitions) {
    std::hash<std::string> stdHash;

    BloomFilter bf1(15, {3, 2, 5}, stdHash);
    BloomFilter bf2(15, {3, 2, 5}, stdHash);
    
    string testUrl = "test_url3";

    // Same input should produce same indexes
    EXPECT_EQ(bf1.getIndexes(testUrl), bf2.getIndexes(testUrl));
    
    // Should return 3 indexes
    EXPECT_EQ(bf1.getIndexes(testUrl).size(), 3);

    // Indexes should be in [0, 14]
    for (int index : bf1.getIndexes(testUrl)) {
        EXPECT_GE(index, 0);
        EXPECT_LT(index, 15);
    }
}
