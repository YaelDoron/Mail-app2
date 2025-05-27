cmake_minimum_required(VERSION 3.10)
project(MailApp)

set(CMAKE_CXX_STANDARD 17)

# Option to toggle between test build and main build
option(BUILD_TESTING "Build tests" OFF)

# Fetch GoogleTest (only when testing is enabled)
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)

if(BUILD_TESTING)
  FetchContent_MakeAvailable(googletest)
endif()

# Include directories
include_directories(
  ${CMAKE_CURRENT_SOURCE_DIR}/commands
  ${CMAKE_CURRENT_SOURCE_DIR}/storage
  ${CMAKE_CURRENT_SOURCE_DIR}
  ${CMAKE_CURRENT_SOURCE_DIR}/tests
)

# Collect all source files
file(GLOB_RECURSE SRC_SOURCES "*.cpp" "*/*.cpp")

list(FILTER SRC_SOURCES EXCLUDE REGEX ".*/\\.cmake/.*")
list(FILTER SRC_SOURCES EXCLUDE REGEX ".*/CMakeFiles/.*")
list(FILTER SRC_SOURCES EXCLUDE REGEX ".*/build/.*")

list(APPEND SRC_SOURCES "Server.cpp")

# Exclude the main file for tests if building the main app
if(NOT BUILD_TESTING)
    list(FILTER SRC_SOURCES EXCLUDE REGEX ".*/tests/.*\\.cpp$")
    list(FILTER SRC_SOURCES EXCLUDE REGEX ".*/main_test.cpp$")
    else()
    list(FILTER SRC_SOURCES EXCLUDE REGEX ".*/main\\.cpp$") 
endif()

# Collect test files if needed
if(BUILD_TESTING)
    message(STATUS "Building tests...")

    file(GLOB TEST_SOURCES "src/cpp_server/tests/*.cpp")
    set(TEST_MAIN_SRC "")
    list(REMOVE_ITEM TEST_SOURCES ${TEST_MAIN_SRC})  # Will add main separately

    add_executable(runTests ${SRC_SOURCES} ${TEST_SOURCES} ${TEST_MAIN_SRC})

    target_link_libraries(runTests
        gtest_main
        pthread
    )

else()
    message(STATUS "Building main application...")

    add_executable(Server ${SRC_SOURCES})
endif()
