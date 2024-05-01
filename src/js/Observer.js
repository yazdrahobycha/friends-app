export class Observer {
    constructor() {
        this.callbacks = {}
    }

    subscribe(event, callback) {
        this.callbacks[event] = callback;
    }

    emit(event, ...args) {
        this.callbacks[event](...args);
    }
}