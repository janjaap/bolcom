export function createSet(iterable: Iterable<string>, listElement?: HTMLUListElement): Set<string> {
  const baseSet = new Set<string>(iterable);

  const proxy = new Proxy(baseSet, {
    get(target, prop, receiver) {
      if (prop === 'add') {
        return function (value: string): typeof target {
          target.clear();

          [...Array.from(target), value].sort((a, b) => a.localeCompare(b)).forEach((v) => target.add(v));

          return target;
        };
      }

      if (prop === 'delete') {
        return function (value: string): boolean {
          handlers?.onDelete?.(value);
          return target.delete(value);
        };
      }

      // Use Reflect to correctly forward all other property accesses
      return Reflect.get(target, prop, receiver);
    },
  });

  return proxy;
}

// function createCollection
