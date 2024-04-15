import { connect } from "nats";
import { waitForMs } from "./utils";

async function start() {
  const nc = await connect({ port: 4222 });
  const done = nc.closed();

  console.log(`connected to ${nc.getServer()}`);

  // TODO: implement service
  await waitForMs(10_000);

  await nc.close();
  const err = await done;

  if (err) {
    console.log(`error closing:`, err);
  }
}

start();
