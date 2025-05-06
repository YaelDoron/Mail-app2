cmake_minimum_required(VERSION 3.10)

project(MyExample)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_executable(myProgram 
    src/BloomFilter.cpp
    src/SaveToFilter.cpp
    src/LoadFromFilter.cpp
    src/addUrl.cpp
    src/checkUrl.cpp
    src/RepeatableHashFunction.cpp
    src/App.cpp
    src/main.cpp
    src/UrlStore.cpp         
)

target_link_libraries(myProgram stdc++fs)

add_executable(runTests 
src/BloomFilterPersistenceTests.cpp 
src/SaveToFilter.cpp
src/LoadFromFilter.cpp  
src/BloomFilter.cpp 
src/add_url_test.cpp 
src/addUrl.cpp 
src/check_url_test.cpp
src/checkUrl.cpp 
src/RepeatableHashFunctionTest.cpp 
src/RepeatableHashFunction.cpp
src/BloomFilterTest.cpp
src/AppTests.cpp
src/App.cpp
src/delete_url_test.cpp
src/deleteUrl.cpp
src/UrlStore.cpp
src/Server.cpp
src/ServerTests.cpp
src/CommandParser.cpp)

target_link_libraries(runTests stdc++fs) # using std::filesystem in c++ 17 

target_link_libraries(runTests gtest_main)
