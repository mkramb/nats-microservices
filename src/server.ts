import { JSONCodec, JetStreamClient, connect } from 'nats';

let logging = false;

async function setupConfig(js: JetStreamClient) {
  const kv = await js.views.kv('config', { history: 5 });
  const item = await kv.get('logging');

  if (item) {
    logging = JSONCodec<boolean>().decode(item.value);
  }

  if (item === null) {
    await kv.create('logging', JSONCodec().encode(false));
  }

  const iter = await kv.watch({
    key: 'logging',
  });

  (async () => {
    for await (const e of iter) {
      logging = JSONCodec<boolean>().decode(e.value);
      console.log(`Logging updated to: "${logging}"`);
    }
  })();
}

(async () => {
  const nc = await connect({ servers: [process.env.NATS_SERVER ?? 'nats:4222'] });
  const js = nc.jetstream();

  await setupConfig(js);

  console.log(`Connected to ${nc.getServer()}`);

  const service = await nc.services.add({
    name: 'math',
    queue: 'math',
    version: '0.0.1',
    description: 'simple calculator service',
  });

  service.stopped.then((err) => {
    console.log(`service stopped ${err ? 'because: ' + err.message : ''}`);
  });

  void service.addEndpoint('max', {
    subject: 'math.max',
    handler: (err, msg) => {
      if (err) console.error(err);

      const numbers = JSONCodec<number[]>().decode(msg.data);
      const result = Math.max(...numbers);

      if (logging) {
        nc.publish(
          `logs.match.max`,
          JSONCodec().encode({ msg: 'Executing max', params: { numbers } }),
        );
      }

      msg.respond(JSONCodec().encode(result));
    },
    metadata: {
      description: 'returns max number of provided input',
      format: 'application/json',
    },
  });

  void service.addEndpoint('sum', {
    subject: 'math.sum',
    handler: (err, msg) => {
      if (err) console.error(err);

      const numbers = JSONCodec<number[]>().decode(msg.data);
      const result = numbers.reduce((a, b) => a + b);

      if (logging) {
        nc.publish(
          `logs.match.find_max`,
          JSONCodec().encode({ msg: 'Executing sum', params: { numbers } }),
        );
      }

      msg.respond(JSONCodec().encode(result));
    },
    metadata: {
      description: 'returns sum of provided input',
      format: 'application/json',
    },
  });

  console.log(`
    Registered nats service:
      - math.max
      - math.sum
  `);
})();
