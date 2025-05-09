class IOInterface:
    def get_input(self):
        raise NotImplementedError

    def display_output(self, message):
        raise NotImplementedError