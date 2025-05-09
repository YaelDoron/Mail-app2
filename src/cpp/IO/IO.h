#ifndef IO_H
#define IO_H

#include <string>

class IO {
public:
    virtual std::string getInput() = 0;
    virtual std::string displayOutput(const std::string& msg) = 0;
    virtual ~IO() = default;
};

#endif