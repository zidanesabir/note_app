class CustomException(Exception):
    def __init__(self, name: str, message: str, status_code: int = 500):
        self.name = name
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)