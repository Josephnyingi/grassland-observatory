import { Container, getContainer } from "@cloudflare/containers";

export class RangelandObservatoryContainer extends Container {
  defaultPort = 8000;
  sleepAfter = "15m";
}

export default {
  async fetch(request, env) {
    const container = getContainer(env.DASHBOARD_CONTAINER, "default");
    return container.fetch(request);
  },
};
