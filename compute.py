import numpy as np

def compute(query, cb=None, cbu=None):
    cbu = cbu if cbu else lambda x: None
    cb = cb if cb else lambda x: None
    cbu(30)
    mu, sigma = 42, 1
    s = round(np.random.normal(mu, sigma))
    cb(s)

