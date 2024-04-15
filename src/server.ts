import { JSONCodec, connect } from "nats";

(async () => {
  const nc = await connect({
    servers: [process.env.NATS_SERVER ?? "nats:4222"],
  });

  console.log(`connected to ${nc.getServer()}`);

  const service = await nc.services.add({
    name: "max",
    version: "0.0.1",
    description: "simple calculator service",
  });

  service.addGroup("math");

  service.stopped.then((err) => {
    console.log(`service stopped ${err ? "because: " + err.message : ""}`);
  });

  void service.addEndpoint("max", {
    subject: "max.find_max",
    handler: (err, msg) => {
      if (err) console.error(err);

      const numbers = JSONCodec<number[]>().decode(msg.data);
      const result = Math.max(...numbers);

      msg.respond(JSONCodec().encode(result));
    },
    metadata: {
      description: "returns max number of provided input",
      format: "application/json",
    },
  });
})();
