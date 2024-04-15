config.define_bool("only-infra")
cfg = config.parse()
only_infra = cfg.get('only-infra', False)

docker_prune_settings(
    disable=False,
    num_builds=3,
    keep_recent=2
)

k8s_yaml(".k8s/nats.yaml")
k8s_resource(
    "nats",
    port_forwards=["4222:4222"]
)

if not only_infra:
    k8s_yaml(".k8s/service.yaml")
    k8s_resource(
        "service",
        port_forwards=["3001:3000"],
        resource_deps=["nats"],
    )
    docker_build(
        "service",
        dockerfile="Dockerfile",
        context=".",
        live_update=[
            sync("./src", "/service/src"),
        ],
        only=["./.npmrc", "./.pnpm-store", "./package.json", "./pnpm-lock.yaml", "./src"],
        network="host",
    )
