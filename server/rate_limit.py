import time
from collections import defaultdict, deque
from fastapi import HTTPException, status

class RateLimiter:
    def __init__(self, max_hits: int, window_seconds: int):
        self.max_hits = max_hits
        self.window = window_seconds
        self.hits = defaultdict(deque)

    def check(self, key: str):
        now = time.time()
        q = self.hits[key]
        while q and q[0] <= now - self.window:
            q.popleft()
        if not q:
            self.hits.pop(key, None)
        if len(q) >= self.max_hits:
            retry = int(q[0] + self.window - now) + 1
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many attempts. Try again later.",
                headers={"Retry-After": str(retry)},
            )

    def hit(self, key: str):
        self.hits[key].append(time.time())

    def reset(self, key: str):
        self.hits.pop(key, None)