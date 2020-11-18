class PromiseExtended {
  public static delay(ms: number): () => Promise<unknown> {
    return () => new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

export default PromiseExtended;