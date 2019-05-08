const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8123 });

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./db.json");
const db = low(adapter);
const countries = require("./countries");

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    try {
      const data = JSON.parse(message);

      switch (data.event) {
        case "register":
          const takenCountries = db.get("countries").value();
          const freeCountries = countries.filter(
            c => !takenCountries.find(tc => tc.id === c.id)
          );
          if (freeCountries.length > 0) {
            const assignCountry = freeCountries[0];
            db.get("countries")
              .push({
                id: assignCountry.id,
                name: data.payload.name
              })
              .write();
            ws.send(
              JSON.stringify({
                event: "country",
                payload: assignCountry.id
              })
            );
          } else {
            ws.send(
              JSON.stringify({
                event: "country",
                payload: ""
              })
            );
          }
          break;
        case "vote":
          const existing = db
            .get("points")
            .find({ votingCountry: data.payload.votingCountry });

          if (!existing.value()) {
            db.get("points")
              .push({ ...data.payload })
              .write();
          } else {
            db.get("points")
              .find({ votingCountry: data.payload.votingCountry })
              .assign({ ...data.payload })
              .write();
          }
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  event: "getvotes",
                  payload: db.get("points").value()
                })
              );
            }
          });
          break;
        case "getvotes":
          ws.send(
            JSON.stringify({
              event: "getvotes",
              payload: db.get("points").value()
            })
          );
          break;
        case "applyvotes":
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  event: "applyvotes",
                  payload: data.payload
                })
              );
            }
          });
          break;
        case "activate":
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  event: "activate",
                  payload: data.payload
                })
              );
            }
          });
          break;
        default:
          throw Error(`unsupported event ${data.event}`);
      }
    } catch (e) {
      console.log(e);
    }
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};
