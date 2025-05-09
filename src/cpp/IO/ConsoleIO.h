#ifndef CONSOLEIO_H
#define CONSOLEIO_H

#include "IO.h"

class ConsoleIO : public IO {
public:
    std::string getInput() override;
    std::string displayOutput(const std::string& msg) override;
};

#endif