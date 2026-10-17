/** LRU for retained assets. Oversized entries are returned to their caller but not retained. */
export class BoundedCache<K, V> extends Map<K, V> {
  private sizes = new Map<K, number>();
  private bytes = 0;
  constructor(private limit = 8, private budget = 32 * 1024 * 1024, private sizeOf: (v: V) => number = v => JSON.stringify(v)?.length * 2 || 0) { super(); }
  override get(key: K): V | undefined {
    const value = super.get(key);
    if (super.has(key)) { super.delete(key); super.set(key, value!); }
    return value;
  }
  override set(key: K, value: V): this {
    this.delete(key);
    const size = this.sizeOf(value);
    if (size > this.budget) return this;
    super.set(key, value); this.sizes.set(key, size); this.bytes += size;
    while (this.size > this.limit || this.bytes > this.budget) this.delete(this.keys().next().value!);
    return this;
  }
  override delete(key: K): boolean {
    this.bytes -= this.sizes.get(key) ?? 0; this.sizes.delete(key);
    return super.delete(key);
  }
  override clear() { super.clear(); this.sizes.clear(); this.bytes = 0; }
}
