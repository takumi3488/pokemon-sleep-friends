export class KvsClient {
  endpoint: string;
  key: string;
  constructor(endpoint: string, key: string) {
    this.endpoint = endpoint;
    this.key = key;
  }

  async get(): Promise<number> {
    const response = await fetch(`${this.endpoint}/${this.key}`);
    if (response.status === 500) {
      throw new Error("Failed to fetch");
    }
    return Number(await response.text());
  }

  async set(value: number): Promise<void> {
    const response = await fetch(`${this.endpoint}/${this.key}`, {
      method: "PUT",
      body: value.toString(),
      headers: {
        "Content-Type": "text/plain",
      }
    });
    if (!response.ok) {
      throw new Error("Failed to set");
    }
  }
}
