"use strict";

class Observable {
  #d;
  constructor(initial) {
    this.#d = initial;
    this.subscribers = [];
  }
  subscribe(callback) {
    this.subscribers.push(callback);
  }
  get data() {
    return this.#d;
  }
  set data(next) {
    this.#d = next;
    for (const sub of this.subscribers) {
      sub(this.#d);
    }
  }
}
