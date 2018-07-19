from tornado import websocket, web, ioloop
import json
import compute

cl = []


def execute_query(query, socket):
    # Do something here
    def cbu(percentage):
        socket.update_progress(percentage)

    def cb(value):
        cbu(100)
        result = json.dumps({'type': 'result', 'value': value})
        socket.write_message(result)

    compute.compute(query, cb, cbu)

def update_clients():
    broadcast(json.dumps({
        'type': 'nb_clients',
        'value': len(cl)
    }))

def broadcast(message):
    for c in cl:
        c.write_message(message)

class IndexHandler(web.RequestHandler):
    def get(self):
        self.render("index.html")

class SocketHandler(websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        if self not in cl:
            cl.append(self)
        update_clients()

    def on_close(self):
        if self in cl:
            cl.remove(self)
        update_clients()

    def on_message(self, query):
        execute_query(query, self)

    def update_progress(self, percentage):
        progress_message = json.dumps({
            'type': 'progress_update',
            'value': percentage
        })
        self.write_message(progress_message)

class ApiHandler(web.RequestHandler):

    @web.asynchronous
    def get(self, *args):
        self.finish()
        value = self.get_argument("value")
        data = {"value" : value}
        data = json.dumps(data)
        for c in cl:
            c.write_message(data)

    @web.asynchronous
    def post(self):
        pass

app = web.Application([
    (r'/', IndexHandler),
    (r'/ws', SocketHandler),
    (r'/api', ApiHandler),
    (r'/(favicon.ico)', web.StaticFileHandler, {'path': '../'}),
    (r'/(search.js|style.css|img/giphy.gif)', web.StaticFileHandler, {'path': './'}),
], debug=True)

if __name__ == '__main__':
    app.listen(8888)
    ioloop.IOLoop.instance().start()
