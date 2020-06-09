export function isValidUrl(string) {
    try {
        new URL(string);
    } catch (_) {
        return false;
    }

    return true;
}

export function buildStrings(strings) {
    let result = "";
    return result.concat(strings);
}