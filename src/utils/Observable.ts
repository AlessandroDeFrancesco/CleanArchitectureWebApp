export type Listener<T> = (value: T) => void;
export type EventListener<T> = (event: T) => void;

export class MutableObservableValue<T> {
  private _value: T;
  private listeners = new Set<Listener<T>>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (newValue === this._value) return;
    this._value = newValue;
    this.emit();
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    listener(this._value);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    for (const listener of this.listeners) {
      listener(this._value);
    }
  }
}

export class ObservableValue<T> {
  protected readonly observable: MutableObservableValue<T>;

  constructor(observable: MutableObservableValue<T>) {
    this.observable = observable;
  }

  get value(): T {
    return this.observable.value;
  }

  subscribe(listener: Listener<T>): () => void {
    return this.observable.subscribe(listener);
  }
}

export class MutableObservableEvent<T> {
  private listeners = new Set<EventListener<T>>();

  emit(payload: T) {
    for (const listener of this.listeners) {
      listener(payload);
    }
  }

  subscribe(listener: EventListener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export class ObservableEvent<T> {
  protected readonly mutableEvent: MutableObservableEvent<T>;

  constructor(mutableEvent: MutableObservableEvent<T>) {
    this.mutableEvent = mutableEvent;
  }

  subscribe(listener: EventListener<T>): () => void {
    return this.mutableEvent.subscribe(listener);
  }
}

export function createMutableObservable<T>(initial: T): MutableObservableValue<T> {
  const observable = new MutableObservableValue(initial);
  return observable;
}

export function getObservable<T>(mutable: MutableObservableValue<T>): ObservableValue<T> {
  return new ObservableValue(mutable);
}

export function createMutableObservableEvent<T>(): MutableObservableEvent<T> {
  const event = new MutableObservableEvent<T>();
  return event;
}

export function getObservableEvent<T>(mutable: MutableObservableEvent<T>): ObservableEvent<T> {
  return new ObservableEvent(mutable);
}