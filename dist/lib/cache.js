"use strict";
/**
 * Based of @thomaspaulnumann work on slack-search
 * @see https://github.com/raycast/extensions/blob/slack-search/extensions/slack-search/src/cache.tsx
 * */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheConfig = exports.persistCacheMiddleware = exports.cacheProvider = void 0;
const api_1 = require("@raycast/api");
const react_1 = require("react");
const SWR_CACHE_KEY = 'swr-cache';
const raycastCache = new api_1.Cache();
const currentCache = raycastCache.get(SWR_CACHE_KEY);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.cacheProvider = new Map(currentCache ? JSON.parse(currentCache) : []);
const persistCacheMiddleware = (useSWRNext) => {
    return (key, fetcher, config) => {
        const swr = useSWRNext(key, fetcher, config);
        (0, react_1.useEffect)(() => {
            try {
                const value = JSON.stringify(Array.from(exports.cacheProvider.entries()));
                raycastCache.set(SWR_CACHE_KEY, value);
            }
            catch (error) {
                console.error('Failed caching data', error);
            }
        }, [swr.data]);
        return swr;
    };
};
exports.persistCacheMiddleware = persistCacheMiddleware;
exports.cacheConfig = {
    provider: () => exports.cacheProvider,
    use: [exports.persistCacheMiddleware],
};
