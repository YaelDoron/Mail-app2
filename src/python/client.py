import socket

class Client:
    def __init__(self, server_ip, server_port, io):
        self.server_ip = server_ip
        self.server_port = server_port
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.io = io

    def run(self):
        print(f"[DEBUG] Trying to connect to {self.server_ip}:{self.server_port}...")
        self.sock.connect((self.server_ip, self.server_port))
        print("[DEBUG] Connected to server.")
        
        try:
            while True:
                msg = self.io.get_input()
                self.sock.send(msg.encode('utf-8'))
                data = self.sock.recv(4096)
                self.io.display_output(data.decode('utf-8'))

        except Exception as e:
            print(f"[ERROR] Connection failed or terminated: {e}")
            return

        finally:
            print("[DEBUG] Closing socket.")
            self.sock.close()
