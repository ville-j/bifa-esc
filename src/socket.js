const ws = new WebSocket("ws://localhost:8123");

const socket = {
  send: (event, data) => {
    ws.send(
      JSON.stringify({
        event,
        data
      })
    );
  }
};

export default socket;
