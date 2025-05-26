#include "ThreadPool.h"
#include <unistd.h>

void workerFunction() {
        while (true) {
            int clientSocket;
            {
                std::unique_lock<std::mutex> lock(queueMutex);
                condition.wait(lock, [this]() { return stop || !tasks.empty(); });

                if (stop && tasks.empty())
                    return;

                clientSocket = tasks.front();
                tasks.pop(); // Mutex is unlocked here
                // std::unique_lock<std::mutex> lock(queueMutex);

            }

            // Process the client outside the critical section
            handleClient(clientSocket);

            // Close the client socket after processing
            close(clientSocket);
        }
}
ThreadPool::ThreadPool(size_t numThreads) : stop(false) {
        for (size_t i = 0; i < numThreads; ++i) {
            workers.emplace_back([this]() { workerFunction(); });
        }
}

ThreadPool::~ThreadPool() {
        {
            std::unique_lock<std::mutex> lock(queueMutex);
            stop = true;
        }

        condition.notify_all(); // Wake up all threads
        for (std::thread &worker : workers) {
            if (worker.joinable()) {
                worker.join();
            }
        }
}

void ThreadPool::addTask(int clientSocket) {
        {
            std::unique_lock<std::mutex> lock(queueMutex);
            tasks.push(clientSocket);
        }
        condition.notify_one(); // Wake up one thread
}