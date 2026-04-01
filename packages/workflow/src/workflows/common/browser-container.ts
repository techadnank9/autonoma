import type { V1Container } from "@kubernetes/client-node";

const BROWSER_IMAGE = "ghcr.io/browserless/chrome:v2.38.2";

export function browserContainer(): V1Container {
    return {
        name: "chrome",
        image: BROWSER_IMAGE,
        command: ["/bin/sh", "-c"],
        args: [
            `nohup ./scripts/start.sh > /tmp/browserless.log 2>&1 &
BROWSERLESS_PID=$!
while ! curl -s http://localhost:3000 >/dev/null 2>&1; do sleep 1; done
while kill -0 $BROWSERLESS_PID 2>/dev/null; do
    if [ -f /tmp/flag/done ]; then kill -TERM $BROWSERLESS_PID; exit 0; fi
    sleep 2
done`,
        ],
        resources: { limits: { cpu: "2" }, requests: { cpu: "2" } },
        volumeMounts: [
            { name: "dshm", mountPath: "/dev/shm" },
            { name: "flag", mountPath: "/tmp/flag" },
        ],
    };
}
