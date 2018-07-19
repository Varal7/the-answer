import numpy as np
import time

def compute(query, cb=None, cbu=None):
    cbu = cbu if cbu else lambda x: None
    cb = cb if cb else lambda x: None

    for i in range(100):
        time.sleep(i/2000)
        cbu(i)

    mu, sigma = 42, 1
    s = round(np.random.normal(mu, sigma))
    cb(s)

