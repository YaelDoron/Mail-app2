#ifndef IO_H
#define IO_H

class Server {
    int port;
public:
    Server(int port, int filterSize, const std::vector<int>& seeds, IO& io);
; // constructor
    int start();
};

#endif
