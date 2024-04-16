# NATS microservices

> A simple way to create microservices that leverage NATS for scalability, load management and observability.

- API Gateway (micro)
- Load Balancing (queue group)
- Service Discovery (micro)
- Config Management (KV)

## Prerequisite

```
brew install kind
brew install tilt-dev/tap/tilt
brew install tilt-dev/tap/ctlptl
```

Install pnpm:

```
corepack enable
corepack prepare pnpm@latest --activate
```

Setting up local cluster:

```
sh .tools/cluster-delete.sh
sh ./tools/cluster-create.sh
```

## Usage

Setup:

```
pnpm install
```

Run services:

```
tilt up

nats req math.sum ""
nats req math.sum "[1,3]"
nats req math.max "[1,3,2]"
```

Inspect registered service:

```
nats micro list
nats micro info math
nats micro stats math
```

Service discovery:

```
nats req '$SRV.INFO' "" --raw | jq
nats req '$SRV.STATS' "" --raw | jq
nats req '$SRV.STATS.math' "" --raw | jq
```

Update config:

```
nats sub "logs.>"

nats kv put config logging true
nats kv put config logging false
```

## Coming soon

Tracing (Nats-Trace-Dest), available in nightly build:

```
./nightly/nats-server
NATS_SERVER=localhost:4222 pnpm start

nats sub trace
nats req math.sum "[1,3]" -H "Nats-Trace-Dest:trace"
```

Deployment using NEX:

- https://nats.io/blog/introducing_nex/
- https://github.com/synadia-io/nex
