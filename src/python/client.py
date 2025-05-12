import socket
import sys

HOST = "172.28.0.2"


def main():
    if len(sys.argv) != 3:
        return
    serverIp = sys.argv[1]
    serverPort = int(sys.argv[2])

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    s.connect((HOST, serverPort))

    try:
        while True:
            msg = input()

            if not msg.strip():
                msg = "<EMPTY>"

            
            encoded = msg.encode('utf-8')
                

            s.send(encoded)

            response = s.recv(4096).decode('utf-8')
            print(response)

    except Exception:
        sys.exit(1)
    finally:
        s.close()

if __name__ == "__main__":
    main()