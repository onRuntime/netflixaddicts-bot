import { writeJson } from './../directory';
import { readJson } from "../resources";

export class Database {
    private file: string;
    private loaded: boolean;
    private data: KeyValue;

    constructor() {
        this.file = 'data.json';
        this.loaded = false;
        this.data = {};
    }

    public get(path: string): any {
        // Finding data or creating it
        if(this.data.hasOwnProperty(path[0]))
    }

    public push(path: string, data: any): Promise<void> {
        return new Promise((resolve, reject) => {
        });
    }

    public exists(path: string): boolean {
        try {
            //getData
            return true;
        } catch(err) {
            throw err;
        }
    }

    public delete(path: string): Promise<void> {
        return new Promise((resolve) => {});
    }

    public reload(): Promise<this> {
        this.loaded = false;

        return this.load();
    }

    public load(): Promise<this> {
        if(this.loaded) return;

        return new Promise((resolve, reject) => {
            try {
                const data = readJson(this.file);
                this.data = JSON.parse(data);
                this.loaded = true;
                resolve(this);
            } catch(err) {
                reject(err);
            }
        });
    }

    public save(force?: boolean): Promise<this> {
        return new Promise((resolve, reject) => {
            if(!force && !this.loaded) {
                reject('Database isn\'t loaded, I can\'t write into.');
            }
            try {
                const data = JSON.stringify(this.data);
                writeJson(this.file, data);
                resolve(this);
            } catch(err) {
                reject(err);
            }
        });
    }
}

interface KeyValue {
    [key: string]: any;
}