# NATS microservices

> A simple way to create microservices that leverage NATS for scalability, load management and observability.

- API Gateway (micro)
- Load Balancing (queue group)
- Discovery (micro)

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