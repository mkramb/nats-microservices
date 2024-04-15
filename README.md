# NATS microservices

> A simple way to create microservices that leverage NATS for scalability, load management and observability.

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

Running services:

```
tilt up
```