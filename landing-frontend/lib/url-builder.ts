/**
 * Builds a full URL with optional query parameters
 */
export function buildUrl(
    path: string,
    query?: Record<string, string | number | boolean | undefined | null>
): string {
    if (!query) return path;

    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
        }
    });

    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
}