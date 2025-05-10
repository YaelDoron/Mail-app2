#include "Server.h"
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <cstdlib>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 3) {
        return 1;
    }

    int port = atoi(argv[1]);
    if (port <= 0 || port > 65535) {
        return 1;
}
    int filterSize = atoi(argv[2]);

    vector<int> seeds;
    for (int i = 3; i < argc; ++i) {
        seeds.push_back(atoi(argv[i]));
    }

    Server server(port, filterSize, seeds);
    return server.start();
}
