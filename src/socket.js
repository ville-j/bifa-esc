const ws = new WebSocket("ws://192.168.1.2:8123");
const hooks = [];

const socket = {
  send: (event, payload) => {
    ws.send(
      JSON.stringify({
        event,
        payload
      })
    );
  },
  on(event, callback) {
    hooks.push({ event, callback });
  }
};

ws.addEventListener("message", function incoming(message) {
  try {
    const data = JSON.parse(message.data);
    hooks
      .filter(h => h.event === data.event)
      .forEach(h => h.callback(data.payload));
  } catch (e) {
    console.log(e);
  }
});

export default socket;
