export class UnknownNavigationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnknownNavigator {
  constructor(
    public readonly value: unknown,
    public readonly path: string | undefined = undefined,
  ) {}

  property(propertyName: string): UnknownNavigator {
    if (typeof this.value !== "object" || this.value === null) {
      throw new UnknownNavigationError("Expected object");
    }

    if (!hasOwnProperty(this.value, propertyName)) {
      throw new UnknownNavigationError(`Expected object to have '${propertyName}'`);
    }

    const newPath = this.path ? `${this.path}.${propertyName}` : propertyName;
    return new UnknownNavigator(this.value[propertyName], newPath);
  }

  expectString(): string {
    if (typeof this.value !== "string") {
      throw new UnknownNavigationError(`Expected '${this.path}' to be a string`);
    }

    return this.value;
  }
}

function hasOwnProperty<K extends string>(obj: object, prop: K): obj is Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
