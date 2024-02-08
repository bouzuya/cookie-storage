"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieStorage = void 0;
const format_cookie_1 = require("./format-cookie");
const parse_cookies_1 = require("./parse-cookies");
class CookieStorage {
    constructor(defaultOptions) {
        this._defaultOptions = Object.assign({ domain: null, expires: null, path: null, secure: false }, defaultOptions);
        if (typeof Proxy !== "undefined")
            return new Proxy(this, cookieStorageHandler);
    }
    get length() {
        const parsed = parse_cookies_1.parseCookies(this._getCookie());
        const keys = Object.keys(parsed);
        return keys.length;
    }
    clear() {
        const parsed = parse_cookies_1.parseCookies(this._getCookie());
        const keys = Object.keys(parsed);
        keys.forEach((key) => this.removeItem(key));
    }
    getItem(key) {
        const parsed = parse_cookies_1.parseCookies(this._getCookie());
        return Object.prototype.hasOwnProperty.call(parsed, key)
            ? parsed[key]
            : null;
    }
    key(index) {
        const parsed = parse_cookies_1.parseCookies(this._getCookie());
        const sortedKeys = Object.keys(parsed).sort();
        return index < sortedKeys.length ? sortedKeys[index] : null;
    }
    removeItem(key, cookieOptions) {
        const data = "";
        const options = Object.assign(Object.assign(Object.assign({}, this._defaultOptions), cookieOptions), { expires: new Date(0) });
        const formatted = format_cookie_1.formatCookie(key, data, options);
        this._setCookie(formatted);
    }
    setItem(key, data, options) {
        const opts = Object.assign(Object.assign({}, this._defaultOptions), options);
        const formatted = format_cookie_1.formatCookie(key, data, opts);
        this._setCookie(formatted);
    }
    _getCookie() {
        return typeof document === "undefined"
            ? ""
            : typeof document.cookie === "undefined"
                ? ""
                : document.cookie;
    }
    _setCookie(value) {
        document.cookie = value;
    }
}
exports.CookieStorage = CookieStorage;
const cookieStorageHandler = {
    defineProperty(target, p, attributes) {
        target.setItem(p.toString(), String(attributes.value));
        return true;
    },
    deleteProperty(target, p) {
        target.removeItem(p.toString());
        return true;
    },
    get(target, p, _receiver) {
        if (typeof p === "string" && p in target)
            return target[p];
        const result = target.getItem(p.toString());
        return result !== null ? result : undefined;
    },
    getOwnPropertyDescriptor(target, p) {
        if (p in target)
            return undefined;
        return {
            configurable: true,
            enumerable: true,
            value: target.getItem(p.toString()),
            writable: true,
        };
    },
    has(target, p) {
        if (typeof p === "string" && p in target)
            return true;
        return target.getItem(p.toString()) !== null;
    },
    ownKeys(target) {
        const keys = [];
        for (let i = 0; i < target.length; i++) {
            const key = target.key(i);
            if (key !== null)
                keys.push(key);
        }
        return keys;
    },
    preventExtensions(_) {
        throw new TypeError("can't prevent extensions on this proxy object");
    },
    set(target, p, value, _) {
        target.setItem(p.toString(), String(value));
        return true;
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29va2llLXN0b3JhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29va2llLXN0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbURBQStDO0FBQy9DLG1EQUErQztBQUcvQyxNQUFhLGFBQWE7SUFHeEIsWUFBWSxjQUE4QjtRQUN4QyxJQUFJLENBQUMsZUFBZSxtQkFDbEIsTUFBTSxFQUFFLElBQUksRUFDWixPQUFPLEVBQUUsSUFBSSxFQUNiLElBQUksRUFBRSxJQUFJLEVBQ1YsTUFBTSxFQUFFLEtBQUssSUFDVixjQUFjLENBQ2xCLENBQUM7UUFDRixJQUFJLE9BQU8sS0FBSyxLQUFLLFdBQVc7WUFFOUIsT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsTUFBTSxNQUFNLEdBQUcsNEJBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUMvQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRU0sS0FBSztRQUNWLE1BQU0sTUFBTSxHQUFHLDRCQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDL0MsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVNLE9BQU8sQ0FBQyxHQUFXO1FBQ3hCLE1BQU0sTUFBTSxHQUFHLDRCQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDL0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztZQUN0RCxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNiLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDWCxDQUFDO0lBRU0sR0FBRyxDQUFDLEtBQWE7UUFDdEIsTUFBTSxNQUFNLEdBQUcsNEJBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUMvQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlDLE9BQU8sS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzlELENBQUM7SUFFTSxVQUFVLENBQUMsR0FBVyxFQUFFLGFBQTZCO1FBQzFELE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNoQixNQUFNLE9BQU8saURBQ1IsSUFBSSxDQUFDLGVBQWUsR0FDcEIsYUFBYSxHQUNiLEVBQUUsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQzVCLENBQUM7UUFDRixNQUFNLFNBQVMsR0FBRyw0QkFBWSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRU0sT0FBTyxDQUFDLEdBQVcsRUFBRSxJQUFZLEVBQUUsT0FBdUI7UUFDL0QsTUFBTSxJQUFJLG1DQUFRLElBQUksQ0FBQyxlQUFlLEdBQUssT0FBTyxDQUFFLENBQUM7UUFDckQsTUFBTSxTQUFTLEdBQUcsNEJBQVksQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVPLFVBQVU7UUFDaEIsT0FBTyxPQUFPLFFBQVEsS0FBSyxXQUFXO1lBQ3BDLENBQUMsQ0FBQyxFQUFFO1lBQ0osQ0FBQyxDQUFDLE9BQU8sUUFBUSxDQUFDLE1BQU0sS0FBSyxXQUFXO2dCQUN4QyxDQUFDLENBQUMsRUFBRTtnQkFDSixDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUN0QixDQUFDO0lBRU8sVUFBVSxDQUFDLEtBQWE7UUFDOUIsUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQztDQUtGO0FBekVELHNDQXlFQztBQUVELE1BQU0sb0JBQW9CLEdBQWdDO0lBQ3hELGNBQWMsQ0FDWixNQUFxQixFQUNyQixDQUFjLEVBQ2QsVUFBOEI7UUFFOUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELGNBQWMsQ0FBQyxNQUFxQixFQUFFLENBQWM7UUFDbEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNoQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxHQUFHLENBQUMsTUFBcUIsRUFBRSxDQUFjLEVBQUUsU0FBYztRQUV2RCxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLElBQUksTUFBTTtZQUFFLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDNUMsT0FBTyxNQUFNLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUM5QyxDQUFDO0lBT0Qsd0JBQXdCLENBQ3RCLE1BQXFCLEVBQ3JCLENBQWM7UUFFZCxJQUFJLENBQUMsSUFBSSxNQUFNO1lBQUUsT0FBTyxTQUFTLENBQUM7UUFDbEMsT0FBTztZQUNMLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLEtBQUssRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQyxRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUM7SUFDSixDQUFDO0lBQ0QsR0FBRyxDQUFDLE1BQXFCLEVBQUUsQ0FBYztRQUN2QyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLElBQUksTUFBTTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ3RELE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUM7SUFDL0MsQ0FBQztJQUNELE9BQU8sQ0FBQyxNQUFxQjtRQUMzQixNQUFNLElBQUksR0FBa0IsRUFBRSxDQUFDO1FBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxHQUFHLEtBQUssSUFBSTtnQkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsaUJBQWlCLENBQUMsQ0FBZ0I7UUFDaEMsTUFBTSxJQUFJLFNBQVMsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxHQUFHLENBQUMsTUFBcUIsRUFBRSxDQUFjLEVBQUUsS0FBVSxFQUFFLENBQU07UUFFM0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDNUMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0YsQ0FBQyJ9