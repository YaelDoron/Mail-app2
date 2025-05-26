#include <vector>
#include <thread>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <atomic>

class ThreadPool {
    private:
        std::vector<std::thread> workers;
        std::queue<std::function<int> tasks; // Queue of client sockets
        std::mutex queueMutex;
        std::condition_variable condition;
        std::atomic<bool> stop;
    public:
    ThreadPool(size_t numThreads);
    ~ThreadPool();
    void addTask(int clientSocket);  // Adds a task { /* some work */ }) to be executed by a worker thread (for handle client)
};