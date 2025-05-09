from io_interface import IOInterface

class ConsoleIO(IOInterface):
    def get_input(self):
        return input()

    def display_output(self, message):
        print(message)