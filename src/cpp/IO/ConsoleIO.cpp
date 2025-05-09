#include "ConsoleIO.h"
#include <iostream>

std::string ConsoleIO::getInput() {
    std::string input;
    std::getline(std::cin, input);
    return input;
}

std::string ConsoleIO::displayOutput(const std::string& msg) {
    return msg;
}