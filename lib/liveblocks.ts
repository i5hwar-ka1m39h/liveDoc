import { Liveblocks } from "@liveblocks/node";

export const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY as string//"sk_dev_BUKyiGWMcNWfUAd2LicPsRK3SRqooKbrHTovE0_NbN6pTINhynYriB4EraFZ1uuc",
  });
  