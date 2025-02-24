import { StorageInterface } from "./types";

export class PlayerStorage {
    public storage: StorageInterface;

    constructor(customStorage: StorageInterface | null = null) {
        this.storage = customStorage || {
            get: (key: string) => Promise.resolve(localStorage.getItem(`nmplayer-${key}`)),
            set: (key: string, value: string) => Promise.resolve(localStorage.setItem(`nmplayer-${key}`, value)),
            remove: (key: string) => Promise.resolve(localStorage.removeItem(`nmplayer-${key}`)),
        };
    }

    async get<T>(key: string, defaultValue: T): Promise<T> {
        const value = await this.storage.get(key);
        if (value !== null) {
            if (typeof defaultValue === "number") {
                const parsedValue = Number(value);
                return isNaN(parsedValue) ? defaultValue : (parsedValue as T);
            }
            try {
                return JSON.parse(value) as T;
            } catch {
                return value as T;
            }
        }
        return defaultValue;
    }

    async set<T>(key: string, value: T): Promise<void> {
        if (typeof value === "number") {
            await this.storage.set(key, Math.round(value).toString());
        } else {
            await this.storage.set(key, JSON.stringify(value));
        }
    }

    async remove(key: string): Promise<void> {
        await this.storage.remove(key);
    }
}

export default PlayerStorage;