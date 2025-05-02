#include "RepeatableHashFunction.h"
#include <gtest/gtest.h>
#include <functional>
#include <string>

using namespace std;

// This test verifies that with repetition = 1, the hash is the same as the base hash.
TEST(RepeatableHashFunctionTest, SingleRepetitionReturnsBaseHash) {
    std::hash<std::string> stdHash;
    string input = "test_string";

    RepeatableHashFunction rhf(1, stdHash);
    size_t result = rhf.hash(input);

    EXPECT_EQ(result, stdHash(input));
}

// This test verifies that with repetition = 4, the hash is the same as the base hash.
TEST(RepeatableHashFunctionTest, FourRepetitionsProducesNestedHash) {
    std::hash<std::string> stdHash;
    string input = "test_string";

    RepeatableHashFunction rhf(4, stdHash);
    size_t result = rhf.hash(input);

    // Manually compute the expected result with 4 nested hashes
    size_t expected = stdHash(input);
    expected = stdHash(to_string(expected));
    expected = stdHash(to_string(expected));
    expected = stdHash(to_string(expected));

    EXPECT_EQ(result, expected);
}

// This test verifies that increasing repetitions changes the result for repetition values.
TEST(RepeatableHashFunctionTest, SmallRepetitionValuesChangeResult) {
    std::hash<std::string> stdHash;
    string input = "test_string";

    RepeatableHashFunction rhf1(1, stdHash);   
    RepeatableHashFunction rhf3(3, stdHash);   

    size_t result1 = rhf1.hash(input);
    size_t result3 = rhf3.hash(input);

    EXPECT_NE(result1, result3);
}

// This test checks that repeated hashing of the same input does not yield unexpected results.
TEST(RepeatableHashFunctionTest, RepeatedHashingWithConstantValues) {
    std::hash<std::string> stdHash;
    string input = "constant_value";  

    RepeatableHashFunction rhf3(3, stdHash);
    size_t result1 = rhf3.hash(input);
    size_t result2 = rhf3.hash(input);

    EXPECT_EQ(result1, result2);
}

