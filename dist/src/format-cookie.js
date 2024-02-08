"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCookie = void 0;
const getSameSiteValue = (o) => {
    const { sameSite } = o;
    if (typeof sameSite === "undefined")
        return null;
    if (["none", "lax", "strict"].indexOf(sameSite.toLowerCase()) >= 0)
        return sameSite;
    return null;
};
const formatOptions = (o) => {
    const { path, domain, expires, secure } = o;
    const sameSiteValue = getSameSiteValue(o);
    return [
        typeof path === "undefined" || path === null ? "" : ";path=" + path,
        typeof domain === "undefined" || domain === null ? "" : ";domain=" + domain,
        typeof expires === "undefined" || expires === null
            ? ""
            : ";expires=" + expires.toUTCString(),
        typeof secure === "undefined" || secure === false ? "" : ";secure",
        sameSiteValue === null ? "" : ";SameSite=" + sameSiteValue,
    ].join("");
};
const formatCookie = (k, d, o) => {
    return [
        encodeURIComponent(k),
        "=",
        encodeURIComponent(d),
        formatOptions(o),
    ].join("");
};
exports.formatCookie = formatCookie;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LWNvb2tpZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXQtY29va2llLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFnQixFQUFpQixFQUFFO0lBQzNELE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdkIsSUFBSSxPQUFPLFFBQVEsS0FBSyxXQUFXO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDakQsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDaEUsT0FBTyxRQUFRLENBQUM7SUFDbEIsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUM7QUFFRixNQUFNLGFBQWEsR0FBRyxDQUFDLENBQWdCLEVBQVUsRUFBRTtJQUNqRCxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sYUFBYSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLE9BQU87UUFDTCxPQUFPLElBQUksS0FBSyxXQUFXLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSTtRQUNuRSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsTUFBTTtRQUMzRSxPQUFPLE9BQU8sS0FBSyxXQUFXLElBQUksT0FBTyxLQUFLLElBQUk7WUFDaEQsQ0FBQyxDQUFDLEVBQUU7WUFDSixDQUFDLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUU7UUFDdkMsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUNsRSxhQUFhLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksR0FBRyxhQUFhO0tBQzNELENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUYsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQWdCLEVBQVUsRUFBRTtJQUN0RSxPQUFPO1FBQ0wsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLEdBQUc7UUFDSCxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7UUFDckIsYUFBYSxDQUFDLENBQUMsQ0FBQztLQUNqQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNiLENBQUMsQ0FBQztBQUVPLG9DQUFZIn0=