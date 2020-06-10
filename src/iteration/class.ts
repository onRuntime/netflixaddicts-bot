export class Hydratable {
    constructor(elements?: string[]) {
        this.hydrate(elements);
    }

    hydrate(elements: string[]) {
        for (let element in elements) {
            if(!elements.hasOwnProperty(element)) {
                continue;
            }
            this[element] = elements[element];
        };
    }
}

export class Jsonable {
    toJSON(): string {
        return JSON.stringify(this);
    }
}