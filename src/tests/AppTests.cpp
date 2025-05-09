#include <gtest/gtest.h>
#include <fstream>
#include <filesystem>
#include <sstream>
#include "App.h"
#include "BloomFilter.h"

// Testing for command 1 - legal input
TEST(AppTests, AddUrlCommand) {

    std::filesystem::create_directory("data"); // creating Data folder if it does not exists already
    std::istringstream input("8 1\n1 www.realtest.com\nexit\n"); //saving an example input, because in tests we don't
    // get it from a user
    std::streambuf* oldCin = std::cin.rdbuf(input.rdbuf());
    std::ostringstream output; // saving the output to the parameter output
    std::streambuf* oldCout = std::cout.rdbuf(output.rdbuf()); 

    App app;
    app.run(); 

    std::cin.rdbuf(oldCin); 
    std::cout.rdbuf(oldCout);

    std::ifstream in("/usr/src/mytest/data/urls.txt"); 
    std::string line;
    bool found = false;
    //checking if the addUrl worked and the url is in the file
    while (std::getline(in, line)) { // reading a line from "in" stream and saving it in line parameter
        if (line == "www.realtest.com") { 
            found = true;
            break;
        }
    }
    in.close();

    EXPECT_TRUE(found); // expecting the url to be in the file (line to contain the url "www.realtest.com")

    //cleaning the files
    std::filesystem::remove("/usr/src/mytest/data/urls.txt");
    std::filesystem::remove("/usr/src/mytest/data/bloom.txt");
}

//Test for ilegal input- an empty line
TEST(AppTests, EmptyInputLine) {
    std::filesystem::create_directory("data"); // creating Data folder if it does not exists already

    std::istringstream input("\n8 1\nexit\n"); // the ilegal input as an input from the user
    std::streambuf* oldCin = std::cin.rdbuf(input.rdbuf());
    std::ostringstream output;
    std::streambuf* oldCout = std::cout.rdbuf(output.rdbuf());

    App app;
    app.run();

    std::cin.rdbuf(oldCin);
    std::cout.rdbuf(oldCout);

    //cleaning the file
    std::filesystem::remove("/usr/src/mytest/data/bloom.txt");
}

// Test for ilegal input- the command 3
TEST(AppTests, UnknownCommand) {
    std::filesystem::create_directory("data"); // creating Data folder if it does not exists already

    std::istringstream input("8 1\n3 www.unknown.com\nexit\n"); // saving the ilegal input as an input from the user
    std::streambuf* oldCin = std::cin.rdbuf(input.rdbuf());
    std::ostringstream output;
    std::streambuf* oldCout = std::cout.rdbuf(output.rdbuf());

    App app; 
    app.run();

    std::cin.rdbuf(oldCin);
    std::cout.rdbuf(oldCout);
    
    //cleaning the file
    std::filesystem::remove("/usr/src/mytest/data/bloom.txt");
}

//Test for command 2 - legal input
TEST(AppTests, AddAndCheckUrl) {
    std::filesystem::create_directory("data");  // creating Data folder if it does not exists already

    std::istringstream input("8 1\n1 www.testcase.com\n2 www.testcase.com\nexit\n"); // adding url and then checking the url
    std::streambuf* oldCin = std::cin.rdbuf(input.rdbuf());
    std::ostringstream output;
    std::streambuf* oldCout = std::cout.rdbuf(output.rdbuf());

    App app; 
    app.run();

    std::cin.rdbuf(oldCin);
    std::cout.rdbuf(oldCout);

    std::string result = output.str();
    EXPECT_NE(result.find("true true"), std::string::npos); // Expecting the check url function to return true true

    std::filesystem::remove("/usr/src/mytest/data/urls.txt");
    std::filesystem::remove("/usr/src/mytest/data/bloom.txt");
}


// Testing for command 1 - ilegal input (no URL in the input)
TEST(AppTests, CommandWithoutUrl) {
    std::filesystem::create_directory("data"); // creating Data folder if it does not exists already

    std::istringstream input("8 1\n1\nexit\n"); // only 1 as a command without the URL
    std::streambuf* oldCin = std::cin.rdbuf(input.rdbuf());
    std::ostringstream output;
    std::streambuf* oldCout = std::cout.rdbuf(output.rdbuf());

    App app;
    app.run();

    std::cin.rdbuf(oldCin);
    std::cout.rdbuf(oldCout);

    std::filesystem::remove("/usr/src/mytest/data/bloom.txt");
}

// checking the filter is saved after getting the command 1 (of adding the URL)
TEST(AppTests, AddUrl_SavesFilterToFile) {
    std::filesystem::create_directory("data");// creating Data folder if it does not exists already

    std::istringstream input("8 1\n1 www.save-check.com\nexit\n");// saving the input as an input from the user
    std::streambuf* oldCin = std::cin.rdbuf(input.rdbuf());
    std::ostringstream output;
    std::streambuf* oldCout = std::cout.rdbuf(output.rdbuf());

    App app;
    app.run();

    std::cin.rdbuf(oldCin);
    std::cout.rdbuf(oldCout);

    
    std::ifstream file("/usr/src/mytest/data/bloom.txt");
    std::string content;
    file >> content;
    file.close();

    EXPECT_FALSE(content.empty()); //checking that the file that suppose to contain the filter is not empty
    std::filesystem::remove("/usr/src/mytest/data/urls.txt");
    std::filesystem::remove("/usr/src/mytest/data/bloom.txt");
}
    