import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { KvsClient } from "./kvs";
import { $, sleep } from "bun";

describe("KVS", async () => {
  let client: KvsClient;

  beforeAll(async () => {
    await $`docker run --rm -d -e ENABLE_KEY_LIST=true -p 8000:8000 --name simple-kvs simple-kvs:pokemon-sleep-friends`;
    client = new KvsClient("http://localhost:8000", "test-key");
    for (; ; sleep(100)) {
      try {
        if ((await $`curl -s http://localhost:8000/`).text() === "[]") {
          break;
        }
      } catch { }
    }
  });

  afterAll(async () => {
    await $`docker stop simple-kvs`;
  });

  test("should set and get the value", async () => {
    await client.set(1);
    const value = await client.get();
    expect(value).toBe(1);
  });
})
