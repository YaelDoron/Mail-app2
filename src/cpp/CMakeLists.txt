cmake_minimum_required(VERSION 3.10)

project(MailApp)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# Give tests access to headers in cpp/
include_directories(${CMAKE_SOURCE_DIR})

add_executable(runTests 
../tests/BloomFilterPersistenceTests.cpp 
SaveToFilter.cpp
LoadFromFilter.cpp  
BloomFilter.cpp 
../tests/add_url_test.cpp 
addUrl.cpp 
../tests/check_url_test.cpp
checkUrl.cpp 
../tests/RepeatableHashFunctionTest.cpp 
RepeatableHashFunction.cpp
../tests/BloomFilterTest.cpp
tests/AppTests.cpp
App.cpp
../tests/delete_url_test.cpp
deleteUrl.cpp
UrlStore.cpp
../tests/CommandParser_test.cpp
CommandParser.cpp
Server.cpp
../tests/ServerTests.cpp)

target_link_libraries(runTests stdc++fs) # using std::filesystem in c++ 17 

target_link_libraries(runTests gtest_main)

add_executable(server
    main.cpp
    Server.cpp
    commands/CommandParser.cpp
    storage/UrlStore.cpp
    commands/addUrl.cpp
    commands/checkUrl.cpp
    commands/deleteUrl.cpp
    storage/BloomFilter.cpp
    storage/SaveToFilter.cpp
    storage/LoadFromFilter.cpp
    storage/RepeatableHashFunction.cpp
    IO/ConsoleIO.cpp
)

target_link_libraries(server stdc++fs)

