# URL Filtering System Using a Bloom Filter

## Overview
This project implements a URL filtering system based on a Bloom Filter.  
It allows:
- Adding URLs to a blacklist.
- Checking whether a URL might be blacklisted (probabilistic check).
- Persisting the Bloom Filter and the URL list across sessions.
- Running all functionalities via a command-line interface (CLI).

It uses C++17, GoogleTest for unit tests, CMake for building, and Docker for containerized execution.

## How to Build and Run
First, build the Docker image by executing:

```bash
docker build -t bloom .
```

Then, to run the actual program:

```bash
docker run -it -v ${PWD}/data:/usr/src/mytest/data bloom /usr/src/mytest/build/myProgram
```

## Running tests
Build the Docker image if you haven’t done it yet.  
And then execute:

```bash
docker run bloom /usr/src/mytest/build/runTests
```

## How to Use the Program

1) **First input** — Initialize the Bloom Filter by providing:
- Filter size (number of bits)
- Repetition values for the hash function

Example input:

![Initialization Example](https://github.com/OrHastar/Mail-app/issues/12)

2) **Then** — you can use commands:
- Example: `1 www.example.com` → Add URL
- Example: `2 www.example.com` → Check if URL is blacklisted

## Example of Adding and Checking a URL
Example input:
![Add/Check Example](https://github.com/OrHastar/Mail-app/issues/13)

## Notes
- False positives may occur.
- False negatives cannot happen.
- After each command, the filter is automatically saved to disk (`data/bloom.txt`) and the URLs are saved in (`data/urls.txt`).

[Team Meeting Documentation](https://docs.google.com/document/d/1N9berFTnWdpFD5PKiMhTC0ZGLjuQ0VxCxpAopiDk-S0/edit?usp=sharing)
