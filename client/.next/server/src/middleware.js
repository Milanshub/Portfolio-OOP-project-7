(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[727],{

/***/ 195:
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ 480:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 518:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ nHandler)
});

// NAMESPACE OBJECT: ./src/middleware.ts
var middleware_namespaceObject = {};
__webpack_require__.r(middleware_namespaceObject);
__webpack_require__.d(middleware_namespaceObject, {
  config: () => (config),
  middleware: () => (middleware)
});

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/globals.js
async function registerInstrumentation() {
    if ("_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && _ENTRIES.middleware_instrumentation.register) {
        try {
            await _ENTRIES.middleware_instrumentation.register();
        } catch (err) {
            err.message = `An error occurred while loading instrumentation hook: ${err.message}`;
            throw err;
        }
    }
}
let registerInstrumentationPromise = null;
function ensureInstrumentationRegistered() {
    if (!registerInstrumentationPromise) {
        registerInstrumentationPromise = registerInstrumentation();
    }
    return registerInstrumentationPromise;
}
function getUnsupportedModuleErrorMessage(module) {
    // warning: if you change these messages, you must adjust how react-dev-overlay's middleware detects modules not found
    return `The edge runtime does not support Node.js '${module}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
}
function __import_unsupported(moduleName) {
    const proxy = new Proxy(function() {}, {
        get (_obj, prop) {
            if (prop === "then") {
                return {};
            }
            throw new Error(getUnsupportedModuleErrorMessage(moduleName));
        },
        construct () {
            throw new Error(getUnsupportedModuleErrorMessage(moduleName));
        },
        apply (_target, _this, args) {
            if (typeof args[0] === "function") {
                return args[0](proxy);
            }
            throw new Error(getUnsupportedModuleErrorMessage(moduleName));
        }
    });
    return new Proxy({}, {
        get: ()=>proxy
    });
}
function enhanceGlobals() {
    // The condition is true when the "process" module is provided
    if (process !== __webpack_require__.g.process) {
        // prefer local process but global.process has correct "env"
        process.env = __webpack_require__.g.process.env;
        __webpack_require__.g.process = process;
    }
    // to allow building code that import but does not use node.js modules,
    // webpack will expect this function to exist in global scope
    Object.defineProperty(globalThis, "__import_unsupported", {
        value: __import_unsupported,
        enumerable: false,
        configurable: false
    });
    // Eagerly fire instrumentation hook to make the startup faster.
    void ensureInstrumentationRegistered();
}
enhanceGlobals(); //# sourceMappingURL=globals.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/error.js
class PageSignatureError extends Error {
    constructor({ page }){
        super(`The middleware "${page}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
    }
}
class RemovedPageError extends Error {
    constructor(){
        super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
    }
}
class RemovedUAError extends Error {
    constructor(){
        super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
    }
} //# sourceMappingURL=error.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/utils.js
/**
 * Converts a Node.js IncomingHttpHeaders object to a Headers object. Any
 * headers with multiple values will be joined with a comma and space. Any
 * headers that have an undefined value will be ignored and others will be
 * coerced to strings.
 *
 * @param nodeHeaders the headers object to convert
 * @returns the converted headers object
 */ function fromNodeOutgoingHttpHeaders(nodeHeaders) {
    const headers = new Headers();
    for (let [key, value] of Object.entries(nodeHeaders)){
        const values = Array.isArray(value) ? value : [
            value
        ];
        for (let v of values){
            if (typeof v === "undefined") continue;
            if (typeof v === "number") {
                v = v.toString();
            }
            headers.append(key, v);
        }
    }
    return headers;
}
/*
  Set-Cookie header field-values are sometimes comma joined in one string. This splits them without choking on commas
  that are within a single set-cookie field-value, such as in the Expires portion.
  This is uncommon, but explicitly allowed - see https://tools.ietf.org/html/rfc2616#section-4.2
  Node.js does this for every header *except* set-cookie - see https://github.com/nodejs/node/blob/d5e363b77ebaf1caf67cd7528224b651c86815c1/lib/_http_incoming.js#L128
  React Native's fetch does this for *every* header, including set-cookie.
  
  Based on: https://github.com/google/j2objc/commit/16820fdbc8f76ca0c33472810ce0cb03d20efe25
  Credits to: https://github.com/tomball for original and https://github.com/chrusart for JavaScript implementation
*/ function splitCookiesString(cookiesString) {
    var cookiesStrings = [];
    var pos = 0;
    var start;
    var ch;
    var lastComma;
    var nextStart;
    var cookiesSeparatorFound;
    function skipWhitespace() {
        while(pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))){
            pos += 1;
        }
        return pos < cookiesString.length;
    }
    function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
    }
    while(pos < cookiesString.length){
        start = pos;
        cookiesSeparatorFound = false;
        while(skipWhitespace()){
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
                // ',' is a cookie separator if we have later first '=', not ';' or ','
                lastComma = pos;
                pos += 1;
                skipWhitespace();
                nextStart = pos;
                while(pos < cookiesString.length && notSpecialChar()){
                    pos += 1;
                }
                // currently special character
                if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                    // we found cookies separator
                    cookiesSeparatorFound = true;
                    // pos is inside the next cookie, so back up and return it.
                    pos = nextStart;
                    cookiesStrings.push(cookiesString.substring(start, lastComma));
                    start = pos;
                } else {
                    // in param ',' or param separator ';',
                    // we continue from that comma
                    pos = lastComma + 1;
                }
            } else {
                pos += 1;
            }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
    }
    return cookiesStrings;
}
/**
 * Converts a Headers object to a Node.js OutgoingHttpHeaders object. This is
 * required to support the set-cookie header, which may have multiple values.
 *
 * @param headers the headers object to convert
 * @returns the converted headers object
 */ function toNodeOutgoingHttpHeaders(headers) {
    const nodeHeaders = {};
    const cookies = [];
    if (headers) {
        for (const [key, value] of headers.entries()){
            if (key.toLowerCase() === "set-cookie") {
                // We may have gotten a comma joined string of cookies, or multiple
                // set-cookie headers. We need to merge them into one header array
                // to represent all the cookies.
                cookies.push(...splitCookiesString(value));
                nodeHeaders[key] = cookies.length === 1 ? cookies[0] : cookies;
            } else {
                nodeHeaders[key] = value;
            }
        }
    }
    return nodeHeaders;
}
/**
 * Validate the correctness of a user-provided URL.
 */ function validateURL(url) {
    try {
        return String(new URL(String(url)));
    } catch (error) {
        throw new Error(`URL is malformed "${String(url)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, {
            cause: error
        });
    }
} //# sourceMappingURL=utils.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/fetch-event.js

const responseSymbol = Symbol("response");
const passThroughSymbol = Symbol("passThrough");
const waitUntilSymbol = Symbol("waitUntil");
class FetchEvent {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(_request){
        this[waitUntilSymbol] = [];
        this[passThroughSymbol] = false;
    }
    respondWith(response) {
        if (!this[responseSymbol]) {
            this[responseSymbol] = Promise.resolve(response);
        }
    }
    passThroughOnException() {
        this[passThroughSymbol] = true;
    }
    waitUntil(promise) {
        this[waitUntilSymbol].push(promise);
    }
}
class NextFetchEvent extends FetchEvent {
    constructor(params){
        super(params.request);
        this.sourcePage = params.page;
    }
    /**
   * @deprecated The `request` is now the first parameter and the API is now async.
   *
   * Read more: https://nextjs.org/docs/messages/middleware-new-signature
   */ get request() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
    /**
   * @deprecated Using `respondWith` is no longer needed.
   *
   * Read more: https://nextjs.org/docs/messages/middleware-new-signature
   */ respondWith() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
} //# sourceMappingURL=fetch-event.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/i18n/detect-domain-locale.js
function detectDomainLocale(domainItems, hostname, detectedLocale) {
    if (!domainItems) return;
    if (detectedLocale) {
        detectedLocale = detectedLocale.toLowerCase();
    }
    for (const item of domainItems){
        var _item_domain, _item_locales;
        // remove port if present
        const domainHostname = (_item_domain = item.domain) == null ? void 0 : _item_domain.split(":", 1)[0].toLowerCase();
        if (hostname === domainHostname || detectedLocale === item.defaultLocale.toLowerCase() || ((_item_locales = item.locales) == null ? void 0 : _item_locales.some((locale)=>locale.toLowerCase() === detectedLocale))) {
            return item;
        }
    }
} //# sourceMappingURL=detect-domain-locale.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/remove-trailing-slash.js
/**
 * Removes the trailing slash for a given route or page path. Preserves the
 * root page. Examples:
 *   - `/foo/bar/` -> `/foo/bar`
 *   - `/foo/bar` -> `/foo/bar`
 *   - `/` -> `/`
 */ function removeTrailingSlash(route) {
    return route.replace(/\/$/, "") || "/";
} //# sourceMappingURL=remove-trailing-slash.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/parse-path.js
/**
 * Given a path this function will find the pathname, query and hash and return
 * them. This is useful to parse full paths on the client side.
 * @param path A path to parse e.g. /foo/bar?id=1#hash
 */ function parsePath(path) {
    const hashIndex = path.indexOf("#");
    const queryIndex = path.indexOf("?");
    const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
    if (hasQuery || hashIndex > -1) {
        return {
            pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
            query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : undefined) : "",
            hash: hashIndex > -1 ? path.slice(hashIndex) : ""
        };
    }
    return {
        pathname: path,
        query: "",
        hash: ""
    };
} //# sourceMappingURL=parse-path.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/add-path-prefix.js

/**
 * Adds the provided prefix to the given path. It first ensures that the path
 * is indeed starting with a slash.
 */ function addPathPrefix(path, prefix) {
    if (!path.startsWith("/") || !prefix) {
        return path;
    }
    const { pathname, query, hash } = parsePath(path);
    return "" + prefix + pathname + query + hash;
} //# sourceMappingURL=add-path-prefix.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/add-path-suffix.js

/**
 * Similarly to `addPathPrefix`, this function adds a suffix at the end on the
 * provided path. It also works only for paths ensuring the argument starts
 * with a slash.
 */ function addPathSuffix(path, suffix) {
    if (!path.startsWith("/") || !suffix) {
        return path;
    }
    const { pathname, query, hash } = parsePath(path);
    return "" + pathname + suffix + query + hash;
} //# sourceMappingURL=add-path-suffix.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/path-has-prefix.js

/**
 * Checks if a given path starts with a given prefix. It ensures it matches
 * exactly without containing extra chars. e.g. prefix /docs should replace
 * for /docs, /docs/, /docs/a but not /docsss
 * @param path The path to check.
 * @param prefix The prefix to check against.
 */ function pathHasPrefix(path, prefix) {
    if (typeof path !== "string") {
        return false;
    }
    const { pathname } = parsePath(path);
    return pathname === prefix || pathname.startsWith(prefix + "/");
} //# sourceMappingURL=path-has-prefix.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/add-locale.js


/**
 * For a given path and a locale, if the locale is given, it will prefix the
 * locale. The path shouldn't be an API path. If a default locale is given the
 * prefix will be omitted if the locale is already the default locale.
 */ function addLocale(path, locale, defaultLocale, ignorePrefix) {
    // If no locale was given or the locale is the default locale, we don't need
    // to prefix the path.
    if (!locale || locale === defaultLocale) return path;
    const lower = path.toLowerCase();
    // If the path is an API path or the path already has the locale prefix, we
    // don't need to prefix the path.
    if (!ignorePrefix) {
        if (pathHasPrefix(lower, "/api")) return path;
        if (pathHasPrefix(lower, "/" + locale.toLowerCase())) return path;
    }
    // Add the locale prefix to the path.
    return addPathPrefix(path, "/" + locale);
} //# sourceMappingURL=add-locale.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/format-next-pathname-info.js




function formatNextPathnameInfo(info) {
    let pathname = addLocale(info.pathname, info.locale, info.buildId ? undefined : info.defaultLocale, info.ignorePrefix);
    if (info.buildId || !info.trailingSlash) {
        pathname = removeTrailingSlash(pathname);
    }
    if (info.buildId) {
        pathname = addPathSuffix(addPathPrefix(pathname, "/_next/data/" + info.buildId), info.pathname === "/" ? "index.json" : ".json");
    }
    pathname = addPathPrefix(pathname, info.basePath);
    return !info.buildId && info.trailingSlash ? !pathname.endsWith("/") ? addPathSuffix(pathname, "/") : pathname : removeTrailingSlash(pathname);
} //# sourceMappingURL=format-next-pathname-info.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/get-hostname.js
/**
 * Takes an object with a hostname property (like a parsed URL) and some
 * headers that may contain Host and returns the preferred hostname.
 * @param parsed An object containing a hostname property.
 * @param headers A dictionary with headers containing a `host`.
 */ function getHostname(parsed, headers) {
    // Get the hostname from the headers if it exists, otherwise use the parsed
    // hostname.
    let hostname;
    if ((headers == null ? void 0 : headers.host) && !Array.isArray(headers.host)) {
        hostname = headers.host.toString().split(":", 1)[0];
    } else if (parsed.hostname) {
        hostname = parsed.hostname;
    } else return;
    return hostname.toLowerCase();
} //# sourceMappingURL=get-hostname.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/i18n/normalize-locale-path.js
/**
 * For a pathname that may include a locale from a list of locales, it
 * removes the locale from the pathname returning it alongside with the
 * detected locale.
 *
 * @param pathname A pathname that may include a locale.
 * @param locales A list of locales.
 * @returns The detected locale and pathname without locale
 */ function normalizeLocalePath(pathname, locales) {
    let detectedLocale;
    // first item will be empty string from splitting at first char
    const pathnameParts = pathname.split("/");
    (locales || []).some((locale)=>{
        if (pathnameParts[1] && pathnameParts[1].toLowerCase() === locale.toLowerCase()) {
            detectedLocale = locale;
            pathnameParts.splice(1, 1);
            pathname = pathnameParts.join("/") || "/";
            return true;
        }
        return false;
    });
    return {
        pathname,
        detectedLocale
    };
} //# sourceMappingURL=normalize-locale-path.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/remove-path-prefix.js

/**
 * Given a path and a prefix it will remove the prefix when it exists in the
 * given path. It ensures it matches exactly without containing extra chars
 * and if the prefix is not there it will be noop.
 *
 * @param path The path to remove the prefix from.
 * @param prefix The prefix to be removed.
 */ function removePathPrefix(path, prefix) {
    // If the path doesn't start with the prefix we can return it as is. This
    // protects us from situations where the prefix is a substring of the path
    // prefix such as:
    //
    // For prefix: /blog
    //
    //   /blog -> true
    //   /blog/ -> true
    //   /blog/1 -> true
    //   /blogging -> false
    //   /blogging/ -> false
    //   /blogging/1 -> false
    if (!pathHasPrefix(path, prefix)) {
        return path;
    }
    // Remove the prefix from the path via slicing.
    const withoutPrefix = path.slice(prefix.length);
    // If the path without the prefix starts with a `/` we can return it as is.
    if (withoutPrefix.startsWith("/")) {
        return withoutPrefix;
    }
    // If the path without the prefix doesn't start with a `/` we need to add it
    // back to the path to make sure it's a valid path.
    return "/" + withoutPrefix;
} //# sourceMappingURL=remove-path-prefix.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/get-next-pathname-info.js



function getNextPathnameInfo(pathname, options) {
    var _options_nextConfig;
    const { basePath, i18n, trailingSlash } = (_options_nextConfig = options.nextConfig) != null ? _options_nextConfig : {};
    const info = {
        pathname,
        trailingSlash: pathname !== "/" ? pathname.endsWith("/") : trailingSlash
    };
    if (basePath && pathHasPrefix(info.pathname, basePath)) {
        info.pathname = removePathPrefix(info.pathname, basePath);
        info.basePath = basePath;
    }
    let pathnameNoDataPrefix = info.pathname;
    if (info.pathname.startsWith("/_next/data/") && info.pathname.endsWith(".json")) {
        const paths = info.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
        const buildId = paths[0];
        info.buildId = buildId;
        pathnameNoDataPrefix = paths[1] !== "index" ? "/" + paths.slice(1).join("/") : "/";
        // update pathname with normalized if enabled although
        // we use normalized to populate locale info still
        if (options.parseData === true) {
            info.pathname = pathnameNoDataPrefix;
        }
    }
    // If provided, use the locale route normalizer to detect the locale instead
    // of the function below.
    if (i18n) {
        let result = options.i18nProvider ? options.i18nProvider.analyze(info.pathname) : normalizeLocalePath(info.pathname, i18n.locales);
        info.locale = result.detectedLocale;
        var _result_pathname;
        info.pathname = (_result_pathname = result.pathname) != null ? _result_pathname : info.pathname;
        if (!result.detectedLocale && info.buildId) {
            result = options.i18nProvider ? options.i18nProvider.analyze(pathnameNoDataPrefix) : normalizeLocalePath(pathnameNoDataPrefix, i18n.locales);
            if (result.detectedLocale) {
                info.locale = result.detectedLocale;
            }
        }
    }
    return info;
} //# sourceMappingURL=get-next-pathname-info.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/next-url.js




const REGEX_LOCALHOST_HOSTNAME = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
function parseURL(url, base) {
    return new URL(String(url).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"), base && String(base).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"));
}
const Internal = Symbol("NextURLInternal");
class NextURL {
    constructor(input, baseOrOpts, opts){
        let base;
        let options;
        if (typeof baseOrOpts === "object" && "pathname" in baseOrOpts || typeof baseOrOpts === "string") {
            base = baseOrOpts;
            options = opts || {};
        } else {
            options = opts || baseOrOpts || {};
        }
        this[Internal] = {
            url: parseURL(input, base ?? options.base),
            options: options,
            basePath: ""
        };
        this.analyze();
    }
    analyze() {
        var _this_Internal_options_nextConfig_i18n, _this_Internal_options_nextConfig, _this_Internal_domainLocale, _this_Internal_options_nextConfig_i18n1, _this_Internal_options_nextConfig1;
        const info = getNextPathnameInfo(this[Internal].url.pathname, {
            nextConfig: this[Internal].options.nextConfig,
            parseData: !undefined,
            i18nProvider: this[Internal].options.i18nProvider
        });
        const hostname = getHostname(this[Internal].url, this[Internal].options.headers);
        this[Internal].domainLocale = this[Internal].options.i18nProvider ? this[Internal].options.i18nProvider.detectDomainLocale(hostname) : detectDomainLocale((_this_Internal_options_nextConfig = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n.domains, hostname);
        const defaultLocale = ((_this_Internal_domainLocale = this[Internal].domainLocale) == null ? void 0 : _this_Internal_domainLocale.defaultLocale) || ((_this_Internal_options_nextConfig1 = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n1 = _this_Internal_options_nextConfig1.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n1.defaultLocale);
        this[Internal].url.pathname = info.pathname;
        this[Internal].defaultLocale = defaultLocale;
        this[Internal].basePath = info.basePath ?? "";
        this[Internal].buildId = info.buildId;
        this[Internal].locale = info.locale ?? defaultLocale;
        this[Internal].trailingSlash = info.trailingSlash;
    }
    formatPathname() {
        return formatNextPathnameInfo({
            basePath: this[Internal].basePath,
            buildId: this[Internal].buildId,
            defaultLocale: !this[Internal].options.forceLocale ? this[Internal].defaultLocale : undefined,
            locale: this[Internal].locale,
            pathname: this[Internal].url.pathname,
            trailingSlash: this[Internal].trailingSlash
        });
    }
    formatSearch() {
        return this[Internal].url.search;
    }
    get buildId() {
        return this[Internal].buildId;
    }
    set buildId(buildId) {
        this[Internal].buildId = buildId;
    }
    get locale() {
        return this[Internal].locale ?? "";
    }
    set locale(locale) {
        var _this_Internal_options_nextConfig_i18n, _this_Internal_options_nextConfig;
        if (!this[Internal].locale || !((_this_Internal_options_nextConfig = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n.locales.includes(locale))) {
            throw new TypeError(`The NextURL configuration includes no locale "${locale}"`);
        }
        this[Internal].locale = locale;
    }
    get defaultLocale() {
        return this[Internal].defaultLocale;
    }
    get domainLocale() {
        return this[Internal].domainLocale;
    }
    get searchParams() {
        return this[Internal].url.searchParams;
    }
    get host() {
        return this[Internal].url.host;
    }
    set host(value) {
        this[Internal].url.host = value;
    }
    get hostname() {
        return this[Internal].url.hostname;
    }
    set hostname(value) {
        this[Internal].url.hostname = value;
    }
    get port() {
        return this[Internal].url.port;
    }
    set port(value) {
        this[Internal].url.port = value;
    }
    get protocol() {
        return this[Internal].url.protocol;
    }
    set protocol(value) {
        this[Internal].url.protocol = value;
    }
    get href() {
        const pathname = this.formatPathname();
        const search = this.formatSearch();
        return `${this.protocol}//${this.host}${pathname}${search}${this.hash}`;
    }
    set href(url) {
        this[Internal].url = parseURL(url);
        this.analyze();
    }
    get origin() {
        return this[Internal].url.origin;
    }
    get pathname() {
        return this[Internal].url.pathname;
    }
    set pathname(value) {
        this[Internal].url.pathname = value;
    }
    get hash() {
        return this[Internal].url.hash;
    }
    set hash(value) {
        this[Internal].url.hash = value;
    }
    get search() {
        return this[Internal].url.search;
    }
    set search(value) {
        this[Internal].url.search = value;
    }
    get password() {
        return this[Internal].url.password;
    }
    set password(value) {
        this[Internal].url.password = value;
    }
    get username() {
        return this[Internal].url.username;
    }
    set username(value) {
        this[Internal].url.username = value;
    }
    get basePath() {
        return this[Internal].basePath;
    }
    set basePath(value) {
        this[Internal].basePath = value.startsWith("/") ? value : `/${value}`;
    }
    toString() {
        return this.href;
    }
    toJSON() {
        return this.href;
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            href: this.href,
            origin: this.origin,
            protocol: this.protocol,
            username: this.username,
            password: this.password,
            host: this.host,
            hostname: this.hostname,
            port: this.port,
            pathname: this.pathname,
            search: this.search,
            searchParams: this.searchParams,
            hash: this.hash
        };
    }
    clone() {
        return new NextURL(String(this), this[Internal].options);
    }
} //# sourceMappingURL=next-url.js.map

// EXTERNAL MODULE: ./node_modules/next/dist/compiled/@edge-runtime/cookies/index.js
var _edge_runtime_cookies = __webpack_require__(492);
;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/cookies.js
 //# sourceMappingURL=cookies.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/request.js




const INTERNALS = Symbol("internal request");
class NextRequest extends Request {
    constructor(input, init = {}){
        const url = typeof input !== "string" && "url" in input ? input.url : String(input);
        validateURL(url);
        if (input instanceof Request) super(input, init);
        else super(url, init);
        const nextUrl = new NextURL(url, {
            headers: toNodeOutgoingHttpHeaders(this.headers),
            nextConfig: init.nextConfig
        });
        this[INTERNALS] = {
            cookies: new _edge_runtime_cookies.RequestCookies(this.headers),
            geo: init.geo || {},
            ip: init.ip,
            nextUrl,
            url:  false ? 0 : nextUrl.toString()
        };
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            cookies: this.cookies,
            geo: this.geo,
            ip: this.ip,
            nextUrl: this.nextUrl,
            url: this.url,
            // rest of props come from Request
            bodyUsed: this.bodyUsed,
            cache: this.cache,
            credentials: this.credentials,
            destination: this.destination,
            headers: Object.fromEntries(this.headers),
            integrity: this.integrity,
            keepalive: this.keepalive,
            method: this.method,
            mode: this.mode,
            redirect: this.redirect,
            referrer: this.referrer,
            referrerPolicy: this.referrerPolicy,
            signal: this.signal
        };
    }
    get cookies() {
        return this[INTERNALS].cookies;
    }
    get geo() {
        return this[INTERNALS].geo;
    }
    get ip() {
        return this[INTERNALS].ip;
    }
    get nextUrl() {
        return this[INTERNALS].nextUrl;
    }
    /**
   * @deprecated
   * `page` has been deprecated in favour of `URLPattern`.
   * Read more: https://nextjs.org/docs/messages/middleware-request-page
   */ get page() {
        throw new RemovedPageError();
    }
    /**
   * @deprecated
   * `ua` has been removed in favour of \`userAgent\` function.
   * Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
   */ get ua() {
        throw new RemovedUAError();
    }
    get url() {
        return this[INTERNALS].url;
    }
} //# sourceMappingURL=request.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/response.js



const response_INTERNALS = Symbol("internal response");
const REDIRECTS = new Set([
    301,
    302,
    303,
    307,
    308
]);
function handleMiddlewareField(init, headers) {
    var _init_request;
    if (init == null ? void 0 : (_init_request = init.request) == null ? void 0 : _init_request.headers) {
        if (!(init.request.headers instanceof Headers)) {
            throw new Error("request.headers must be an instance of Headers");
        }
        const keys = [];
        for (const [key, value] of init.request.headers){
            headers.set("x-middleware-request-" + key, value);
            keys.push(key);
        }
        headers.set("x-middleware-override-headers", keys.join(","));
    }
}
class NextResponse extends Response {
    constructor(body, init = {}){
        super(body, init);
        this[response_INTERNALS] = {
            cookies: new _edge_runtime_cookies.ResponseCookies(this.headers),
            url: init.url ? new NextURL(init.url, {
                headers: toNodeOutgoingHttpHeaders(this.headers),
                nextConfig: init.nextConfig
            }) : undefined
        };
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            cookies: this.cookies,
            url: this.url,
            // rest of props come from Response
            body: this.body,
            bodyUsed: this.bodyUsed,
            headers: Object.fromEntries(this.headers),
            ok: this.ok,
            redirected: this.redirected,
            status: this.status,
            statusText: this.statusText,
            type: this.type
        };
    }
    get cookies() {
        return this[response_INTERNALS].cookies;
    }
    static json(body, init) {
        const response = Response.json(body, init);
        return new NextResponse(response.body, response);
    }
    static redirect(url, init) {
        const status = typeof init === "number" ? init : (init == null ? void 0 : init.status) ?? 307;
        if (!REDIRECTS.has(status)) {
            throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        const initObj = typeof init === "object" ? init : {};
        const headers = new Headers(initObj == null ? void 0 : initObj.headers);
        headers.set("Location", validateURL(url));
        return new NextResponse(null, {
            ...initObj,
            headers,
            status
        });
    }
    static rewrite(destination, init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set("x-middleware-rewrite", validateURL(destination));
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
    static next(init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set("x-middleware-next", "1");
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
} //# sourceMappingURL=response.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/relativize-url.js
/**
 * Given a URL as a string and a base URL it will make the URL relative
 * if the parsed protocol and host is the same as the one in the base
 * URL. Otherwise it returns the same URL string.
 */ function relativizeURL(url, base) {
    const baseURL = typeof base === "string" ? new URL(base) : base;
    const relative = new URL(url, base);
    const origin = baseURL.protocol + "//" + baseURL.host;
    return relative.protocol + "//" + relative.host === origin ? relative.toString().replace(origin, "") : relative.toString();
} //# sourceMappingURL=relativize-url.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/client/components/app-router-headers.js
const RSC_HEADER = "RSC";
const ACTION = "Next-Action";
const NEXT_ROUTER_STATE_TREE = "Next-Router-State-Tree";
const NEXT_ROUTER_PREFETCH_HEADER = "Next-Router-Prefetch";
const NEXT_URL = "Next-Url";
const RSC_CONTENT_TYPE_HEADER = "text/x-component";
const RSC_VARY_HEADER = RSC_HEADER + ", " + NEXT_ROUTER_STATE_TREE + ", " + NEXT_ROUTER_PREFETCH_HEADER + ", " + NEXT_URL;
const FLIGHT_PARAMETERS = [
    [
        RSC_HEADER
    ],
    [
        NEXT_ROUTER_STATE_TREE
    ],
    [
        NEXT_ROUTER_PREFETCH_HEADER
    ]
];
const NEXT_RSC_UNION_QUERY = "_rsc"; //# sourceMappingURL=app-router-headers.js.map

// EXTERNAL MODULE: ./node_modules/next/dist/esm/shared/lib/modern-browserslist-target.js
var modern_browserslist_target = __webpack_require__(459);
;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/constants.js


const COMPILER_NAMES = {
    client: "client",
    server: "server",
    edgeServer: "edge-server"
};
/**
 * Headers that are set by the Next.js server and should be stripped from the
 * request headers going to the user's application.
 */ const constants_INTERNAL_HEADERS = (/* unused pure expression or super */ null && ([
    "x-invoke-error",
    "x-invoke-output",
    "x-invoke-path",
    "x-invoke-query",
    "x-invoke-status",
    "x-middleware-invoke"
]));
const COMPILER_INDEXES = {
    [COMPILER_NAMES.client]: 0,
    [COMPILER_NAMES.server]: 1,
    [COMPILER_NAMES.edgeServer]: 2
};
const PHASE_EXPORT = "phase-export";
const PHASE_PRODUCTION_BUILD = "phase-production-build";
const PHASE_PRODUCTION_SERVER = "phase-production-server";
const PHASE_DEVELOPMENT_SERVER = "phase-development-server";
const PHASE_TEST = "phase-test";
const PHASE_INFO = "phase-info";
const PAGES_MANIFEST = "pages-manifest.json";
const APP_PATHS_MANIFEST = "app-paths-manifest.json";
const APP_PATH_ROUTES_MANIFEST = "app-path-routes-manifest.json";
const BUILD_MANIFEST = "build-manifest.json";
const APP_BUILD_MANIFEST = "app-build-manifest.json";
const FUNCTIONS_CONFIG_MANIFEST = "functions-config-manifest.json";
const SUBRESOURCE_INTEGRITY_MANIFEST = "subresource-integrity-manifest";
const NEXT_FONT_MANIFEST = "next-font-manifest";
const EXPORT_MARKER = "export-marker.json";
const EXPORT_DETAIL = "export-detail.json";
const PRERENDER_MANIFEST = "prerender-manifest.json";
const ROUTES_MANIFEST = "routes-manifest.json";
const IMAGES_MANIFEST = "images-manifest.json";
const SERVER_FILES_MANIFEST = "required-server-files.json";
const DEV_CLIENT_PAGES_MANIFEST = "_devPagesManifest.json";
const MIDDLEWARE_MANIFEST = "middleware-manifest.json";
const DEV_MIDDLEWARE_MANIFEST = "_devMiddlewareManifest.json";
const REACT_LOADABLE_MANIFEST = "react-loadable-manifest.json";
const FONT_MANIFEST = "font-manifest.json";
const SERVER_DIRECTORY = "server";
const CONFIG_FILES = (/* unused pure expression or super */ null && ([
    "next.config.js",
    "next.config.mjs"
]));
const BUILD_ID_FILE = "BUILD_ID";
const BLOCKED_PAGES = (/* unused pure expression or super */ null && ([
    "/_document",
    "/_app",
    "/_error"
]));
const CLIENT_PUBLIC_FILES_PATH = "public";
const CLIENT_STATIC_FILES_PATH = "static";
const STRING_LITERAL_DROP_BUNDLE = "__NEXT_DROP_CLIENT_FILE__";
const NEXT_BUILTIN_DOCUMENT = "__NEXT_BUILTIN_DOCUMENT__";
const BARREL_OPTIMIZATION_PREFIX = "__barrel_optimize__";
// server/[entry]/page_client-reference-manifest.js
const CLIENT_REFERENCE_MANIFEST = "client-reference-manifest";
// server/server-reference-manifest
const SERVER_REFERENCE_MANIFEST = "server-reference-manifest";
// server/middleware-build-manifest.js
const MIDDLEWARE_BUILD_MANIFEST = "middleware-build-manifest";
// server/middleware-react-loadable-manifest.js
const MIDDLEWARE_REACT_LOADABLE_MANIFEST = "middleware-react-loadable-manifest";
// static/runtime/main.js
const CLIENT_STATIC_FILES_RUNTIME_MAIN = "main";
const CLIENT_STATIC_FILES_RUNTIME_MAIN_APP = "" + CLIENT_STATIC_FILES_RUNTIME_MAIN + "-app";
// next internal client components chunk for layouts
const APP_CLIENT_INTERNALS = "app-pages-internals";
// static/runtime/react-refresh.js
const CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH = "react-refresh";
// static/runtime/amp.js
const CLIENT_STATIC_FILES_RUNTIME_AMP = "amp";
// static/runtime/webpack.js
const CLIENT_STATIC_FILES_RUNTIME_WEBPACK = "webpack";
// static/runtime/polyfills.js
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS = "polyfills";
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL = Symbol(CLIENT_STATIC_FILES_RUNTIME_POLYFILLS);
const EDGE_RUNTIME_WEBPACK = "edge-runtime-webpack";
const TEMPORARY_REDIRECT_STATUS = 307;
const PERMANENT_REDIRECT_STATUS = 308;
const STATIC_PROPS_ID = "__N_SSG";
const SERVER_PROPS_ID = "__N_SSP";
const PAGE_SEGMENT_KEY = "__PAGE__";
const GOOGLE_FONT_PROVIDER = "https://fonts.googleapis.com/";
const OPTIMIZED_FONT_PROVIDERS = [
    {
        url: GOOGLE_FONT_PROVIDER,
        preconnect: "https://fonts.gstatic.com"
    },
    {
        url: "https://use.typekit.net",
        preconnect: "https://use.typekit.net"
    }
];
const DEFAULT_SERIF_FONT = {
    name: "Times New Roman",
    xAvgCharWidth: 821,
    azAvgWidth: 854.3953488372093,
    unitsPerEm: 2048
};
const DEFAULT_SANS_SERIF_FONT = {
    name: "Arial",
    xAvgCharWidth: 904,
    azAvgWidth: 934.5116279069767,
    unitsPerEm: 2048
};
const STATIC_STATUS_PAGES = (/* unused pure expression or super */ null && ([
    "/500"
]));
const TRACE_OUTPUT_VERSION = 1;
// in `MB`
const TURBO_TRACE_DEFAULT_MEMORY_LIMIT = 6000;
const RSC_MODULE_TYPES = {
    client: "client",
    server: "server"
};
// comparing
// https://nextjs.org/docs/api-reference/edge-runtime
// with
// https://nodejs.org/docs/latest/api/globals.html
const EDGE_UNSUPPORTED_NODE_APIS = (/* unused pure expression or super */ null && ([
    "clearImmediate",
    "setImmediate",
    "BroadcastChannel",
    "ByteLengthQueuingStrategy",
    "CompressionStream",
    "CountQueuingStrategy",
    "DecompressionStream",
    "DomException",
    "MessageChannel",
    "MessageEvent",
    "MessagePort",
    "ReadableByteStreamController",
    "ReadableStreamBYOBRequest",
    "ReadableStreamDefaultController",
    "TransformStreamDefaultController",
    "WritableStreamDefaultController"
]));
const SYSTEM_ENTRYPOINTS = new Set([
    CLIENT_STATIC_FILES_RUNTIME_MAIN,
    CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH,
    CLIENT_STATIC_FILES_RUNTIME_AMP,
    CLIENT_STATIC_FILES_RUNTIME_MAIN_APP
]); //# sourceMappingURL=constants.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/internal-utils.js


const INTERNAL_QUERY_NAMES = [
    "__nextFallback",
    "__nextLocale",
    "__nextInferredLocaleFromDefault",
    "__nextDefaultLocale",
    "__nextIsNotFound",
    NEXT_RSC_UNION_QUERY
];
const EDGE_EXTENDED_INTERNAL_QUERY_NAMES = [
    "__nextDataReq"
];
function stripInternalQueries(query) {
    for (const name of INTERNAL_QUERY_NAMES){
        delete query[name];
    }
}
function stripInternalSearchParams(url, isEdge) {
    const isStringUrl = typeof url === "string";
    const instance = isStringUrl ? new URL(url) : url;
    for (const name of INTERNAL_QUERY_NAMES){
        instance.searchParams.delete(name);
    }
    if (isEdge) {
        for (const name of EDGE_EXTENDED_INTERNAL_QUERY_NAMES){
            instance.searchParams.delete(name);
        }
    }
    return isStringUrl ? instance.toString() : instance;
}
/**
 * Strip internal headers from the request headers.
 *
 * @param headers the headers to strip of internal headers
 */ function stripInternalHeaders(headers) {
    for (const key of INTERNAL_HEADERS){
        delete headers[key];
    }
} //# sourceMappingURL=internal-utils.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/app-paths.js


/**
 * Normalizes an app route so it represents the actual request path. Essentially
 * performing the following transformations:
 *
 * - `/(dashboard)/user/[id]/page` to `/user/[id]`
 * - `/(dashboard)/account/page` to `/account`
 * - `/user/[id]/page` to `/user/[id]`
 * - `/account/page` to `/account`
 * - `/page` to `/`
 * - `/(dashboard)/user/[id]/route` to `/user/[id]`
 * - `/(dashboard)/account/route` to `/account`
 * - `/user/[id]/route` to `/user/[id]`
 * - `/account/route` to `/account`
 * - `/route` to `/`
 * - `/` to `/`
 *
 * @param route the app route to normalize
 * @returns the normalized pathname
 */ function normalizeAppPath(route) {
    return ensureLeadingSlash(route.split("/").reduce((pathname, segment, index, segments)=>{
        // Empty segments are ignored.
        if (!segment) {
            return pathname;
        }
        // Groups are ignored.
        if (isGroupSegment(segment)) {
            return pathname;
        }
        // Parallel segments are ignored.
        if (segment[0] === "@") {
            return pathname;
        }
        // The last segment (if it's a leaf) should be ignored.
        if ((segment === "page" || segment === "route") && index === segments.length - 1) {
            return pathname;
        }
        return pathname + "/" + segment;
    }, ""));
}
/**
 * Strips the `.rsc` extension if it's in the pathname.
 * Since this function is used on full urls it checks `?` for searchParams handling.
 */ function normalizeRscURL(url) {
    return url.replace(/\.rsc($|\?)/, "$1");
} //# sourceMappingURL=app-paths.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/lib/constants.js
const NEXT_QUERY_PARAM_PREFIX = "nxtP";
const PRERENDER_REVALIDATE_HEADER = "x-prerender-revalidate";
const PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER = "x-prerender-revalidate-if-generated";
const NEXT_DID_POSTPONE_HEADER = "x-nextjs-postponed";
const RSC_PREFETCH_SUFFIX = ".prefetch.rsc";
const RSC_SUFFIX = ".rsc";
const NEXT_DATA_SUFFIX = ".json";
const NEXT_META_SUFFIX = ".meta";
const NEXT_BODY_SUFFIX = ".body";
const NEXT_CACHE_TAGS_HEADER = "x-next-cache-tags";
const NEXT_CACHE_SOFT_TAGS_HEADER = "x-next-cache-soft-tags";
const NEXT_CACHE_REVALIDATED_TAGS_HEADER = "x-next-revalidated-tags";
const NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER = "x-next-revalidate-tag-token";
const NEXT_CACHE_TAG_MAX_LENGTH = 256;
const NEXT_CACHE_SOFT_TAG_MAX_LENGTH = 1024;
const NEXT_CACHE_IMPLICIT_TAG_ID = "_N_T_";
// in seconds
const CACHE_ONE_YEAR = 31536000;
// Patterns to detect middleware files
const MIDDLEWARE_FILENAME = "middleware";
const MIDDLEWARE_LOCATION_REGEXP = (/* unused pure expression or super */ null && (`(?:src/)?${MIDDLEWARE_FILENAME}`));
// Pattern to detect instrumentation hooks file
const INSTRUMENTATION_HOOK_FILENAME = "instrumentation";
// Because on Windows absolute paths in the generated code can break because of numbers, eg 1 in the path,
// we have to use a private alias
const PAGES_DIR_ALIAS = "private-next-pages";
const DOT_NEXT_ALIAS = "private-dot-next";
const ROOT_DIR_ALIAS = "private-next-root-dir";
const APP_DIR_ALIAS = "private-next-app-dir";
const RSC_MOD_REF_PROXY_ALIAS = "private-next-rsc-mod-ref-proxy";
const RSC_ACTION_VALIDATE_ALIAS = "private-next-rsc-action-validate";
const RSC_ACTION_PROXY_ALIAS = "private-next-rsc-action-proxy";
const RSC_ACTION_ENCRYPTION_ALIAS = "private-next-rsc-action-encryption";
const RSC_ACTION_CLIENT_WRAPPER_ALIAS = "private-next-rsc-action-client-wrapper";
const PUBLIC_DIR_MIDDLEWARE_CONFLICT = (/* unused pure expression or super */ null && (`You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://nextjs.org/docs/messages/public-next-folder-conflict`));
const SSG_GET_INITIAL_PROPS_CONFLICT = (/* unused pure expression or super */ null && (`You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps`));
const SERVER_PROPS_GET_INIT_PROPS_CONFLICT = (/* unused pure expression or super */ null && (`You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.`));
const SERVER_PROPS_SSG_CONFLICT = (/* unused pure expression or super */ null && (`You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps`));
const STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR = (/* unused pure expression or super */ null && (`can not have getInitialProps/getServerSideProps, https://nextjs.org/docs/messages/404-get-initial-props`));
const SERVER_PROPS_EXPORT_ERROR = (/* unused pure expression or super */ null && (`pages with \`getServerSideProps\` can not be exported. See more info here: https://nextjs.org/docs/messages/gssp-export`));
const GSP_NO_RETURNED_VALUE = "Your `getStaticProps` function did not return an object. Did you forget to add a `return`?";
const GSSP_NO_RETURNED_VALUE = "Your `getServerSideProps` function did not return an object. Did you forget to add a `return`?";
const UNSTABLE_REVALIDATE_RENAME_ERROR = (/* unused pure expression or super */ null && ("The `unstable_revalidate` property is available for general use.\n" + "Please use `revalidate` instead."));
const GSSP_COMPONENT_MEMBER_ERROR = (/* unused pure expression or super */ null && (`can not be attached to a page's component and must be exported from the page. See more info here: https://nextjs.org/docs/messages/gssp-component-member`));
const NON_STANDARD_NODE_ENV = (/* unused pure expression or super */ null && (`You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env`));
const SSG_FALLBACK_EXPORT_ERROR = (/* unused pure expression or super */ null && (`Pages with \`fallback\` enabled in \`getStaticPaths\` can not be exported. See more info here: https://nextjs.org/docs/messages/ssg-fallback-true-export`));
const ESLINT_DEFAULT_DIRS = (/* unused pure expression or super */ null && ([
    "app",
    "pages",
    "components",
    "lib",
    "src"
]));
const ESLINT_PROMPT_VALUES = [
    {
        title: "Strict",
        recommended: true,
        config: {
            extends: "next/core-web-vitals"
        }
    },
    {
        title: "Base",
        config: {
            extends: "next"
        }
    },
    {
        title: "Cancel",
        config: null
    }
];
const SERVER_RUNTIME = {
    edge: "edge",
    experimentalEdge: "experimental-edge",
    nodejs: "nodejs"
};
/**
 * The names of the webpack layers. These layers are the primitives for the
 * webpack chunks.
 */ const WEBPACK_LAYERS_NAMES = {
    /**
   * The layer for the shared code between the client and server bundles.
   */ shared: "shared",
    /**
   * React Server Components layer (rsc).
   */ reactServerComponents: "rsc",
    /**
   * Server Side Rendering layer for app (ssr).
   */ serverSideRendering: "ssr",
    /**
   * The browser client bundle layer for actions.
   */ actionBrowser: "action-browser",
    /**
   * The layer for the API routes.
   */ api: "api",
    /**
   * The layer for the middleware code.
   */ middleware: "middleware",
    /**
   * The layer for assets on the edge.
   */ edgeAsset: "edge-asset",
    /**
   * The browser client bundle layer for App directory.
   */ appPagesBrowser: "app-pages-browser",
    /**
   * The server bundle layer for metadata routes.
   */ appMetadataRoute: "app-metadata-route",
    /**
   * The layer for the server bundle for App Route handlers.
   */ appRouteHandler: "app-route-handler"
};
const WEBPACK_LAYERS = {
    ...WEBPACK_LAYERS_NAMES,
    GROUP: {
        server: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.appMetadataRoute,
            WEBPACK_LAYERS_NAMES.appRouteHandler
        ],
        nonClientServerTarget: [
            // plus middleware and pages api
            WEBPACK_LAYERS_NAMES.middleware,
            WEBPACK_LAYERS_NAMES.api
        ],
        app: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.appMetadataRoute,
            WEBPACK_LAYERS_NAMES.appRouteHandler,
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser
        ]
    }
};
const WEBPACK_RESOURCE_QUERIES = {
    edgeSSREntry: "__next_edge_ssr_entry__",
    metadata: "__next_metadata__",
    metadataRoute: "__next_metadata_route__",
    metadataImageMeta: "__next_metadata_image_meta__"
};
 //# sourceMappingURL=constants.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/adapters/reflect.js
class ReflectAdapter {
    static get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === "function") {
            return value.bind(target);
        }
        return value;
    }
    static set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
    }
    static has(target, prop) {
        return Reflect.has(target, prop);
    }
    static deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
    }
} //# sourceMappingURL=reflect.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/adapters/headers.js

/**
 * @internal
 */ class ReadonlyHeadersError extends Error {
    constructor(){
        super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
    }
    static callable() {
        throw new ReadonlyHeadersError();
    }
}
class HeadersAdapter extends Headers {
    constructor(headers){
        // We've already overridden the methods that would be called, so we're just
        // calling the super constructor to ensure that the instanceof check works.
        super();
        this.headers = new Proxy(headers, {
            get (target, prop, receiver) {
                // Because this is just an object, we expect that all "get" operations
                // are for properties. If it's a "get" for a symbol, we'll just return
                // the symbol.
                if (typeof prop === "symbol") {
                    return ReflectAdapter.get(target, prop, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return undefined.
                if (typeof original === "undefined") return;
                // If the original casing exists, return the value.
                return ReflectAdapter.get(target, original, receiver);
            },
            set (target, prop, value, receiver) {
                if (typeof prop === "symbol") {
                    return ReflectAdapter.set(target, prop, value, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, use the prop as the key.
                return ReflectAdapter.set(target, original ?? prop, value, receiver);
            },
            has (target, prop) {
                if (typeof prop === "symbol") return ReflectAdapter.has(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return false.
                if (typeof original === "undefined") return false;
                // If the original casing exists, return true.
                return ReflectAdapter.has(target, original);
            },
            deleteProperty (target, prop) {
                if (typeof prop === "symbol") return ReflectAdapter.deleteProperty(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return true.
                if (typeof original === "undefined") return true;
                // If the original casing exists, delete the property.
                return ReflectAdapter.deleteProperty(target, original);
            }
        });
    }
    /**
   * Seals a Headers instance to prevent modification by throwing an error when
   * any mutating method is called.
   */ static seal(headers) {
        return new Proxy(headers, {
            get (target, prop, receiver) {
                switch(prop){
                    case "append":
                    case "delete":
                    case "set":
                        return ReadonlyHeadersError.callable;
                    default:
                        return ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
    /**
   * Merges a header value into a string. This stores multiple values as an
   * array, so we need to merge them into a string.
   *
   * @param value a header value
   * @returns a merged header value (a string)
   */ merge(value) {
        if (Array.isArray(value)) return value.join(", ");
        return value;
    }
    /**
   * Creates a Headers instance from a plain object or a Headers instance.
   *
   * @param headers a plain object or a Headers instance
   * @returns a headers instance
   */ static from(headers) {
        if (headers instanceof Headers) return headers;
        return new HeadersAdapter(headers);
    }
    append(name, value) {
        const existing = this.headers[name];
        if (typeof existing === "string") {
            this.headers[name] = [
                existing,
                value
            ];
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            this.headers[name] = value;
        }
    }
    delete(name) {
        delete this.headers[name];
    }
    get(name) {
        const value = this.headers[name];
        if (typeof value !== "undefined") return this.merge(value);
        return null;
    }
    has(name) {
        return typeof this.headers[name] !== "undefined";
    }
    set(name, value) {
        this.headers[name] = value;
    }
    forEach(callbackfn, thisArg) {
        for (const [name, value] of this.entries()){
            callbackfn.call(thisArg, value, name, this);
        }
    }
    *entries() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(name);
            yield [
                name,
                value
            ];
        }
    }
    *keys() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            yield name;
        }
    }
    *values() {
        for (const key of Object.keys(this.headers)){
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(key);
            yield value;
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
} //# sourceMappingURL=headers.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/adapters/request-cookies.js


/**
 * @internal
 */ class ReadonlyRequestCookiesError extends Error {
    constructor(){
        super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options");
    }
    static callable() {
        throw new ReadonlyRequestCookiesError();
    }
}
class RequestCookiesAdapter {
    static seal(cookies) {
        return new Proxy(cookies, {
            get (target, prop, receiver) {
                switch(prop){
                    case "clear":
                    case "delete":
                    case "set":
                        return ReadonlyRequestCookiesError.callable;
                    default:
                        return ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
}
const SYMBOL_MODIFY_COOKIE_VALUES = Symbol.for("next.mutated.cookies");
function getModifiedCookieValues(cookies) {
    const modified = cookies[SYMBOL_MODIFY_COOKIE_VALUES];
    if (!modified || !Array.isArray(modified) || modified.length === 0) {
        return [];
    }
    return modified;
}
function appendMutableCookies(headers, mutableCookies) {
    const modifiedCookieValues = getModifiedCookieValues(mutableCookies);
    if (modifiedCookieValues.length === 0) {
        return false;
    }
    // Return a new response that extends the response with
    // the modified cookies as fallbacks. `res` cookies
    // will still take precedence.
    const resCookies = new ResponseCookies(headers);
    const returnedCookies = resCookies.getAll();
    // Set the modified cookies as fallbacks.
    for (const cookie of modifiedCookieValues){
        resCookies.set(cookie);
    }
    // Set the original cookies as the final values.
    for (const cookie of returnedCookies){
        resCookies.set(cookie);
    }
    return true;
}
class MutableRequestCookiesAdapter {
    static wrap(cookies, onUpdateCookies) {
        const responseCookes = new _edge_runtime_cookies.ResponseCookies(new Headers());
        for (const cookie of cookies.getAll()){
            responseCookes.set(cookie);
        }
        let modifiedValues = [];
        const modifiedCookies = new Set();
        const updateResponseCookies = ()=>{
            var _fetch___nextGetStaticStore;
            // TODO-APP: change method of getting staticGenerationAsyncStore
            const staticGenerationAsyncStore = fetch.__nextGetStaticStore == null ? void 0 : (_fetch___nextGetStaticStore = fetch.__nextGetStaticStore.call(fetch)) == null ? void 0 : _fetch___nextGetStaticStore.getStore();
            if (staticGenerationAsyncStore) {
                staticGenerationAsyncStore.pathWasRevalidated = true;
            }
            const allCookies = responseCookes.getAll();
            modifiedValues = allCookies.filter((c)=>modifiedCookies.has(c.name));
            if (onUpdateCookies) {
                const serializedCookies = [];
                for (const cookie of modifiedValues){
                    const tempCookies = new _edge_runtime_cookies.ResponseCookies(new Headers());
                    tempCookies.set(cookie);
                    serializedCookies.push(tempCookies.toString());
                }
                onUpdateCookies(serializedCookies);
            }
        };
        return new Proxy(responseCookes, {
            get (target, prop, receiver) {
                switch(prop){
                    // A special symbol to get the modified cookie values
                    case SYMBOL_MODIFY_COOKIE_VALUES:
                        return modifiedValues;
                    // TODO: Throw error if trying to set a cookie after the response
                    // headers have been set.
                    case "delete":
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === "string" ? args[0] : args[0].name);
                            try {
                                target.delete(...args);
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    case "set":
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === "string" ? args[0] : args[0].name);
                            try {
                                return target.set(...args);
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    default:
                        return ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
} //# sourceMappingURL=request-cookies.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/api-utils/index.js


/**
 *
 * @param res response object
 * @param statusCode `HTTP` status code of response
 */ function sendStatusCode(res, statusCode) {
    res.statusCode = statusCode;
    return res;
}
/**
 *
 * @param res response object
 * @param [statusOrUrl] `HTTP` status code of redirect
 * @param url URL of redirect
 */ function redirect(res, statusOrUrl, url) {
    if (typeof statusOrUrl === "string") {
        url = statusOrUrl;
        statusOrUrl = 307;
    }
    if (typeof statusOrUrl !== "number" || typeof url !== "string") {
        throw new Error(`Invalid redirect arguments. Please use a single argument URL, e.g. res.redirect('/destination') or use a status code and URL, e.g. res.redirect(307, '/destination').`);
    }
    res.writeHead(statusOrUrl, {
        Location: url
    });
    res.write(url);
    res.end();
    return res;
}
function checkIsOnDemandRevalidate(req, previewProps) {
    const headers = HeadersAdapter.from(req.headers);
    const previewModeId = headers.get(PRERENDER_REVALIDATE_HEADER);
    const isOnDemandRevalidate = previewModeId === previewProps.previewModeId;
    const revalidateOnlyGenerated = headers.has(PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER);
    return {
        isOnDemandRevalidate,
        revalidateOnlyGenerated
    };
}
const COOKIE_NAME_PRERENDER_BYPASS = `__prerender_bypass`;
const COOKIE_NAME_PRERENDER_DATA = `__next_preview_data`;
const RESPONSE_LIMIT_DEFAULT = (/* unused pure expression or super */ null && (4 * 1024 * 1024));
const SYMBOL_PREVIEW_DATA = Symbol(COOKIE_NAME_PRERENDER_DATA);
const SYMBOL_CLEARED_COOKIES = Symbol(COOKIE_NAME_PRERENDER_BYPASS);
function clearPreviewData(res, options = {}) {
    if (SYMBOL_CLEARED_COOKIES in res) {
        return res;
    }
    const { serialize } = __webpack_require__(842);
    const previous = res.getHeader("Set-Cookie");
    res.setHeader(`Set-Cookie`, [
        ...typeof previous === "string" ? [
            previous
        ] : Array.isArray(previous) ? previous : [],
        serialize(COOKIE_NAME_PRERENDER_BYPASS, "", {
            // To delete a cookie, set `expires` to a date in the past:
            // https://tools.ietf.org/html/rfc6265#section-4.1.1
            // `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
            expires: new Date(0),
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/",
            ...options.path !== undefined ? {
                path: options.path
            } : undefined
        }),
        serialize(COOKIE_NAME_PRERENDER_DATA, "", {
            // To delete a cookie, set `expires` to a date in the past:
            // https://tools.ietf.org/html/rfc6265#section-4.1.1
            // `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
            expires: new Date(0),
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/",
            ...options.path !== undefined ? {
                path: options.path
            } : undefined
        })
    ]);
    Object.defineProperty(res, SYMBOL_CLEARED_COOKIES, {
        value: true,
        enumerable: false
    });
    return res;
}
/**
 * Custom error class
 */ class ApiError extends (/* unused pure expression or super */ null && (Error)) {
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
    }
}
/**
 * Sends error in `response`
 * @param res response object
 * @param statusCode of response
 * @param message of response
 */ function sendError(res, statusCode, message) {
    res.statusCode = statusCode;
    res.statusMessage = message;
    res.end(message);
}
/**
 * Execute getter function only if its needed
 * @param LazyProps `req` and `params` for lazyProp
 * @param prop name of property
 * @param getter function to get data
 */ function setLazyProp({ req }, prop, getter) {
    const opts = {
        configurable: true,
        enumerable: true
    };
    const optsReset = {
        ...opts,
        writable: true
    };
    Object.defineProperty(req, prop, {
        ...opts,
        get: ()=>{
            const value = getter();
            // we set the property on the object to avoid recalculating it
            Object.defineProperty(req, prop, {
                ...optsReset,
                value
            });
            return value;
        },
        set: (value)=>{
            Object.defineProperty(req, prop, {
                ...optsReset,
                value
            });
        }
    });
} //# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/async-storage/draft-mode-provider.js

class DraftModeProvider {
    constructor(previewProps, req, cookies, mutableCookies){
        var _cookies_get;
        // The logic for draftMode() is very similar to tryGetPreviewData()
        // but Draft Mode does not have any data associated with it.
        const isOnDemandRevalidate = previewProps && checkIsOnDemandRevalidate(req, previewProps).isOnDemandRevalidate;
        const cookieValue = (_cookies_get = cookies.get(COOKIE_NAME_PRERENDER_BYPASS)) == null ? void 0 : _cookies_get.value;
        this.isEnabled = Boolean(!isOnDemandRevalidate && cookieValue && previewProps && cookieValue === previewProps.previewModeId);
        this._previewModeId = previewProps == null ? void 0 : previewProps.previewModeId;
        this._mutableCookies = mutableCookies;
    }
    enable() {
        if (!this._previewModeId) {
            throw new Error("Invariant: previewProps missing previewModeId this should never happen");
        }
        this._mutableCookies.set({
            name: COOKIE_NAME_PRERENDER_BYPASS,
            value: this._previewModeId,
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/"
        });
    }
    disable() {
        // To delete a cookie, set `expires` to a date in the past:
        // https://tools.ietf.org/html/rfc6265#section-4.1.1
        // `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
        this._mutableCookies.set({
            name: COOKIE_NAME_PRERENDER_BYPASS,
            value: "",
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/",
            expires: new Date(0)
        });
    }
} //# sourceMappingURL=draft-mode-provider.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/async-storage/request-async-storage-wrapper.js





function getHeaders(headers) {
    const cleaned = HeadersAdapter.from(headers);
    for (const param of FLIGHT_PARAMETERS){
        cleaned.delete(param.toString().toLowerCase());
    }
    return HeadersAdapter.seal(cleaned);
}
function getCookies(headers) {
    const cookies = new _edge_runtime_cookies.RequestCookies(HeadersAdapter.from(headers));
    return RequestCookiesAdapter.seal(cookies);
}
function getMutableCookies(headers, onUpdateCookies) {
    const cookies = new _edge_runtime_cookies.RequestCookies(HeadersAdapter.from(headers));
    return MutableRequestCookiesAdapter.wrap(cookies, onUpdateCookies);
}
const RequestAsyncStorageWrapper = {
    /**
   * Wrap the callback with the given store so it can access the underlying
   * store using hooks.
   *
   * @param storage underlying storage object returned by the module
   * @param context context to seed the store
   * @param callback function to call within the scope of the context
   * @returns the result returned by the callback
   */ wrap (storage, { req, res, renderOpts }, callback) {
        let previewProps = undefined;
        if (renderOpts && "previewProps" in renderOpts) {
            // TODO: investigate why previewProps isn't on RenderOpts
            previewProps = renderOpts.previewProps;
        }
        function defaultOnUpdateCookies(cookies) {
            if (res) {
                res.setHeader("Set-Cookie", cookies);
            }
        }
        const cache = {};
        const store = {
            get headers () {
                if (!cache.headers) {
                    // Seal the headers object that'll freeze out any methods that could
                    // mutate the underlying data.
                    cache.headers = getHeaders(req.headers);
                }
                return cache.headers;
            },
            get cookies () {
                if (!cache.cookies) {
                    // Seal the cookies object that'll freeze out any methods that could
                    // mutate the underlying data.
                    cache.cookies = getCookies(req.headers);
                }
                return cache.cookies;
            },
            get mutableCookies () {
                if (!cache.mutableCookies) {
                    cache.mutableCookies = getMutableCookies(req.headers, (renderOpts == null ? void 0 : renderOpts.onUpdateCookies) || (res ? defaultOnUpdateCookies : undefined));
                }
                return cache.mutableCookies;
            },
            get draftMode () {
                if (!cache.draftMode) {
                    cache.draftMode = new DraftModeProvider(previewProps, req, this.cookies, this.mutableCookies);
                }
                return cache.draftMode;
            }
        };
        return storage.run(store, callback, store);
    }
}; //# sourceMappingURL=request-async-storage-wrapper.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/client/components/async-local-storage.js
const sharedAsyncLocalStorageNotAvailableError = new Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available");
class FakeAsyncLocalStorage {
    disable() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
    getStore() {
        // This fake implementation of AsyncLocalStorage always returns `undefined`.
        return undefined;
    }
    run() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
    exit() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
    enterWith() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
}
const maybeGlobalAsyncLocalStorage = globalThis.AsyncLocalStorage;
function createAsyncLocalStorage() {
    if (maybeGlobalAsyncLocalStorage) {
        return new maybeGlobalAsyncLocalStorage();
    }
    return new FakeAsyncLocalStorage();
} //# sourceMappingURL=async-local-storage.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/client/components/request-async-storage.external.js

const requestAsyncStorage = createAsyncLocalStorage(); //# sourceMappingURL=request-async-storage.external.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/adapter.js















class NextRequestHint extends NextRequest {
    constructor(params){
        super(params.input, params.init);
        this.sourcePage = params.page;
    }
    get request() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
    respondWith() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
    waitUntil() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
}
async function adapter(params) {
    await ensureInstrumentationRegistered();
    // TODO-APP: use explicit marker for this
    const isEdgeRendering = typeof self.__BUILD_MANIFEST !== "undefined";
    const prerenderManifest = typeof self.__PRERENDER_MANIFEST === "string" ? JSON.parse(self.__PRERENDER_MANIFEST) : undefined;
    params.request.url = normalizeRscURL(params.request.url);
    const requestUrl = new NextURL(params.request.url, {
        headers: params.request.headers,
        nextConfig: params.request.nextConfig
    });
    // Iterator uses an index to keep track of the current iteration. Because of deleting and appending below we can't just use the iterator.
    // Instead we use the keys before iteration.
    const keys = [
        ...requestUrl.searchParams.keys()
    ];
    for (const key of keys){
        const value = requestUrl.searchParams.getAll(key);
        if (key !== NEXT_QUERY_PARAM_PREFIX && key.startsWith(NEXT_QUERY_PARAM_PREFIX)) {
            const normalizedKey = key.substring(NEXT_QUERY_PARAM_PREFIX.length);
            requestUrl.searchParams.delete(normalizedKey);
            for (const val of value){
                requestUrl.searchParams.append(normalizedKey, val);
            }
            requestUrl.searchParams.delete(key);
        }
    }
    // Ensure users only see page requests, never data requests.
    const buildId = requestUrl.buildId;
    requestUrl.buildId = "";
    const isDataReq = params.request.headers["x-nextjs-data"];
    if (isDataReq && requestUrl.pathname === "/index") {
        requestUrl.pathname = "/";
    }
    const requestHeaders = fromNodeOutgoingHttpHeaders(params.request.headers);
    const flightHeaders = new Map();
    // Parameters should only be stripped for middleware
    if (!isEdgeRendering) {
        for (const param of FLIGHT_PARAMETERS){
            const key = param.toString().toLowerCase();
            const value = requestHeaders.get(key);
            if (value) {
                flightHeaders.set(key, requestHeaders.get(key));
                requestHeaders.delete(key);
            }
        }
    }
    const normalizeUrl =  false ? 0 : requestUrl;
    const request = new NextRequestHint({
        page: params.page,
        // Strip internal query parameters off the request.
        input: stripInternalSearchParams(normalizeUrl, true).toString(),
        init: {
            body: params.request.body,
            geo: params.request.geo,
            headers: requestHeaders,
            ip: params.request.ip,
            method: params.request.method,
            nextConfig: params.request.nextConfig,
            signal: params.request.signal
        }
    });
    /**
   * This allows to identify the request as a data request. The user doesn't
   * need to know about this property neither use it. We add it for testing
   * purposes.
   */ if (isDataReq) {
        Object.defineProperty(request, "__isData", {
            enumerable: false,
            value: true
        });
    }
    if (!globalThis.__incrementalCache && params.IncrementalCache) {
        globalThis.__incrementalCache = new params.IncrementalCache({
            appDir: true,
            fetchCache: true,
            minimalMode: "production" !== "development",
            fetchCacheKeyPrefix: undefined,
            dev: "production" === "development",
            requestHeaders: params.request.headers,
            requestProtocol: "https",
            getPrerenderManifest: ()=>{
                return {
                    version: -1,
                    routes: {},
                    dynamicRoutes: {},
                    notFoundRoutes: [],
                    preview: {
                        previewModeId: "development-id"
                    }
                };
            }
        });
    }
    const event = new NextFetchEvent({
        request,
        page: params.page
    });
    let response;
    let cookiesFromResponse;
    // we only care to make async storage available for middleware
    const isMiddleware = params.page === "/middleware" || params.page === "/src/middleware";
    if (isMiddleware) {
        response = await RequestAsyncStorageWrapper.wrap(requestAsyncStorage, {
            req: request,
            renderOpts: {
                onUpdateCookies: (cookies)=>{
                    cookiesFromResponse = cookies;
                },
                // @ts-expect-error: TODO: investigate why previewProps isn't on RenderOpts
                previewProps: (prerenderManifest == null ? void 0 : prerenderManifest.preview) || {
                    previewModeId: "development-id",
                    previewModeEncryptionKey: "",
                    previewModeSigningKey: ""
                }
            }
        }, ()=>params.handler(request, event));
    } else {
        response = await params.handler(request, event);
    }
    // check if response is a Response object
    if (response && !(response instanceof Response)) {
        throw new TypeError("Expected an instance of Response to be returned");
    }
    if (response && cookiesFromResponse) {
        response.headers.set("set-cookie", cookiesFromResponse);
    }
    /**
   * For rewrites we must always include the locale in the final pathname
   * so we re-create the NextURL forcing it to include it when the it is
   * an internal rewrite. Also we make sure the outgoing rewrite URL is
   * a data URL if the request was a data request.
   */ const rewrite = response == null ? void 0 : response.headers.get("x-middleware-rewrite");
    if (response && rewrite) {
        const rewriteUrl = new NextURL(rewrite, {
            forceLocale: true,
            headers: params.request.headers,
            nextConfig: params.request.nextConfig
        });
        if (true) {
            if (rewriteUrl.host === request.nextUrl.host) {
                rewriteUrl.buildId = buildId || rewriteUrl.buildId;
                response.headers.set("x-middleware-rewrite", String(rewriteUrl));
            }
        }
        /**
     * When the request is a data request we must show if there was a rewrite
     * with an internal header so the client knows which component to load
     * from the data request.
     */ const relativizedRewrite = relativizeURL(String(rewriteUrl), String(requestUrl));
        if (isDataReq && // if the rewrite is external and external rewrite
        // resolving config is enabled don't add this header
        // so the upstream app can set it instead
        !(undefined && 0)) {
            response.headers.set("x-nextjs-rewrite", relativizedRewrite);
        }
    }
    /**
   * For redirects we will not include the locale in case when it is the
   * default and we must also make sure the outgoing URL is a data one if
   * the incoming request was a data request.
   */ const redirect = response == null ? void 0 : response.headers.get("Location");
    if (response && redirect && !isEdgeRendering) {
        const redirectURL = new NextURL(redirect, {
            forceLocale: false,
            headers: params.request.headers,
            nextConfig: params.request.nextConfig
        });
        /**
     * Responses created from redirects have immutable headers so we have
     * to clone the response to be able to modify it.
     */ response = new Response(response.body, response);
        if (true) {
            if (redirectURL.host === request.nextUrl.host) {
                redirectURL.buildId = buildId || redirectURL.buildId;
                response.headers.set("Location", String(redirectURL));
            }
        }
        /**
     * When the request is a data request we can't use the location header as
     * it may end up with CORS error. Instead we map to an internal header so
     * the client knows the destination.
     */ if (isDataReq) {
            response.headers.delete("Location");
            response.headers.set("x-nextjs-redirect", relativizeURL(String(redirectURL), String(requestUrl)));
        }
    }
    const finalResponse = response ? response : NextResponse.next();
    // Flight headers are not overridable / removable so they are applied at the end.
    const middlewareOverrideHeaders = finalResponse.headers.get("x-middleware-override-headers");
    const overwrittenHeaders = [];
    if (middlewareOverrideHeaders) {
        for (const [key, value] of flightHeaders){
            finalResponse.headers.set(`x-middleware-request-${key}`, value);
            overwrittenHeaders.push(key);
        }
        if (overwrittenHeaders.length > 0) {
            finalResponse.headers.set("x-middleware-override-headers", middlewareOverrideHeaders + "," + overwrittenHeaders.join(","));
        }
    }
    return {
        response: finalResponse,
        waitUntil: Promise.all(event[waitUntilSymbol]),
        fetchMetrics: request.fetchMetrics
    };
} //# sourceMappingURL=adapter.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/exports/next-response.js
// This file is for modularized imports for next/server to get fully-treeshaking.
 //# sourceMappingURL=next-response.js.map

// EXTERNAL MODULE: ./node_modules/@upstash/ratelimit/dist/index.js
var dist = __webpack_require__(466);
// EXTERNAL MODULE: ./node_modules/crypto-js/enc-hex.js
var enc_hex = __webpack_require__(106);
// EXTERNAL MODULE: ./node_modules/crypto-js/sha1.js
var sha1 = __webpack_require__(743);
;// CONCATENATED MODULE: ./node_modules/@upstash/redis/chunk-FV6JMGNF.mjs
var __defProp = Object.defineProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
// pkg/error.ts
var error_exports = {};
__export(error_exports, {
    UpstashError: ()=>UpstashError,
    UrlError: ()=>UrlError
});
var UpstashError = class extends Error {
    constructor(message){
        super(message);
        this.name = "UpstashError";
    }
};
var UrlError = class extends Error {
    constructor(url){
        super(`Upstash Redis client was passed an invalid URL. You should pass a URL starting with https. Received: "${url}". `);
        this.name = "UrlError";
    }
};
// pkg/http.ts
var HttpClient = class {
    constructor(config){
        this.upstashSyncToken = "";
        this.options = {
            backend: config.options?.backend,
            agent: config.agent,
            responseEncoding: config.responseEncoding ?? "base64",
            // default to base64
            cache: config.cache,
            signal: config.signal,
            keepAlive: config.keepAlive ?? true
        };
        this.upstashSyncToken = "";
        this.readYourWrites = config.readYourWrites ?? true;
        this.baseUrl = (config.baseUrl || "").replace(/\/$/, "");
        const urlRegex = /^https?:\/\/[^\s#$./?].\S*$/;
        if (this.baseUrl && !urlRegex.test(this.baseUrl)) {
            throw new UrlError(this.baseUrl);
        }
        this.headers = {
            "Content-Type": "application/json",
            ...config.headers
        };
        this.hasCredentials = Boolean(this.baseUrl && this.headers.authorization.split(" ")[1]);
        if (this.options.responseEncoding === "base64") {
            this.headers["Upstash-Encoding"] = "base64";
        }
        this.retry = typeof config.retry === "boolean" && !config.retry ? {
            attempts: 1,
            backoff: ()=>0
        } : {
            attempts: config.retry?.retries ?? 5,
            backoff: config.retry?.backoff ?? ((retryCount)=>Math.exp(retryCount) * 50)
        };
    }
    mergeTelemetry(telemetry) {
        this.headers = merge(this.headers, "Upstash-Telemetry-Runtime", telemetry.runtime);
        this.headers = merge(this.headers, "Upstash-Telemetry-Platform", telemetry.platform);
        this.headers = merge(this.headers, "Upstash-Telemetry-Sdk", telemetry.sdk);
    }
    async request(req) {
        const requestOptions = {
            //@ts-expect-error this should throw due to bun regression
            cache: this.options.cache,
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(req.body),
            keepalive: this.options.keepAlive,
            agent: this.options.agent,
            signal: this.options.signal,
            /**
       * Fastly specific
       */ backend: this.options.backend
        };
        if (!this.hasCredentials) {
            ;
        }
        if (this.readYourWrites) {
            const newHeader = this.upstashSyncToken;
            this.headers["upstash-sync-token"] = newHeader;
        }
        let res = null;
        let error = null;
        for(let i = 0; i <= this.retry.attempts; i++){
            try {
                res = await fetch([
                    this.baseUrl,
                    ...req.path ?? []
                ].join("/"), requestOptions);
                break;
            } catch (error_) {
                if (this.options.signal?.aborted) {
                    const myBlob = new Blob([
                        JSON.stringify({
                            result: this.options.signal.reason ?? "Aborted"
                        })
                    ]);
                    const myOptions = {
                        status: 200,
                        statusText: this.options.signal.reason ?? "Aborted"
                    };
                    res = new Response(myBlob, myOptions);
                    break;
                }
                error = error_;
                await new Promise((r)=>setTimeout(r, this.retry.backoff(i)));
            }
        }
        if (!res) {
            throw error ?? new Error("Exhausted all retries");
        }
        const body = await res.json();
        if (!res.ok) {
            throw new UpstashError(`${body.error}, command was: ${JSON.stringify(req.body)}`);
        }
        if (this.readYourWrites) {
            const headers = res.headers;
            this.upstashSyncToken = headers.get("upstash-sync-token") ?? "";
        }
        if (this.readYourWrites) {
            const headers = res.headers;
            this.upstashSyncToken = headers.get("upstash-sync-token") ?? "";
        }
        if (this.options.responseEncoding === "base64") {
            if (Array.isArray(body)) {
                return body.map(({ result: result2, error: error2 })=>({
                        result: decode(result2),
                        error: error2
                    }));
            }
            const result = decode(body.result);
            return {
                result,
                error: body.error
            };
        }
        return body;
    }
};
function base64decode(b64) {
    let dec = "";
    try {
        const binString = atob(b64);
        const size = binString.length;
        const bytes = new Uint8Array(size);
        for(let i = 0; i < size; i++){
            bytes[i] = binString.charCodeAt(i);
        }
        dec = new TextDecoder().decode(bytes);
    } catch  {
        dec = b64;
    }
    return dec;
}
function decode(raw) {
    let result = void 0;
    switch(typeof raw){
        case "undefined":
            {
                return raw;
            }
        case "number":
            {
                result = raw;
                break;
            }
        case "object":
            {
                if (Array.isArray(raw)) {
                    result = raw.map((v)=>typeof v === "string" ? base64decode(v) : Array.isArray(v) ? v.map((element)=>decode(element)) : v);
                } else {
                    result = null;
                }
                break;
            }
        case "string":
            {
                result = raw === "OK" ? "OK" : base64decode(raw);
                break;
            }
        default:
            {
                break;
            }
    }
    return result;
}
function merge(obj, key, value) {
    if (!value) {
        return obj;
    }
    obj[key] = obj[key] ? [
        obj[key],
        value
    ].join(",") : value;
    return obj;
}
// pkg/util.ts
function parseRecursive(obj) {
    const parsed = Array.isArray(obj) ? obj.map((o)=>{
        try {
            return parseRecursive(o);
        } catch  {
            return o;
        }
    }) : JSON.parse(obj);
    if (typeof parsed === "number" && parsed.toString() !== obj) {
        return obj;
    }
    return parsed;
}
function parseResponse(result) {
    try {
        return parseRecursive(result);
    } catch  {
        return result;
    }
}
function deserializeScanResponse(result) {
    return [
        result[0],
        ...parseResponse(result.slice(1))
    ];
}
// pkg/commands/command.ts
var defaultSerializer = (c)=>{
    switch(typeof c){
        case "string":
        case "number":
        case "boolean":
            {
                return c;
            }
        default:
            {
                return JSON.stringify(c);
            }
    }
};
var Command = class {
    /**
   * Create a new command instance.
   *
   * You can define a custom `deserialize` function. By default we try to deserialize as json.
   */ constructor(command, opts){
        this.serialize = defaultSerializer;
        this.deserialize = opts?.automaticDeserialization === void 0 || opts.automaticDeserialization ? opts?.deserialize ?? parseResponse : (x)=>x;
        this.command = command.map((c)=>this.serialize(c));
        if (opts?.latencyLogging) {
            const originalExec = this.exec.bind(this);
            this.exec = async (client)=>{
                const start = performance.now();
                const result = await originalExec(client);
                const end = performance.now();
                const loggerResult = (end - start).toFixed(2);
                ;
                return result;
            };
        }
    }
    /**
   * Execute the command using a client.
   */ async exec(client) {
        const { result, error } = await client.request({
            body: this.command,
            upstashSyncToken: client.upstashSyncToken
        });
        if (error) {
            throw new UpstashError(error);
        }
        if (result === void 0) {
            throw new TypeError("Request did not return a result");
        }
        return this.deserialize(result);
    }
};
// pkg/commands/hrandfield.ts
function deserialize(result) {
    if (result.length === 0) {
        return null;
    }
    const obj = {};
    while(result.length >= 2){
        const key = result.shift();
        const value = result.shift();
        try {
            obj[key] = JSON.parse(value);
        } catch  {
            obj[key] = value;
        }
    }
    return obj;
}
var HRandFieldCommand = class extends Command {
    constructor(cmd, opts){
        const command = [
            "hrandfield",
            cmd[0]
        ];
        if (typeof cmd[1] === "number") {
            command.push(cmd[1]);
        }
        if (cmd[2]) {
            command.push("WITHVALUES");
        }
        super(command, {
            // @ts-expect-error to silence compiler
            deserialize: cmd[2] ? (result)=>deserialize(result) : opts?.deserialize,
            ...opts
        });
    }
};
// pkg/commands/append.ts
var AppendCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "append",
            ...cmd
        ], opts);
    }
};
// pkg/commands/bitcount.ts
var BitCountCommand = class extends Command {
    constructor([key, start, end], opts){
        const command = [
            "bitcount",
            key
        ];
        if (typeof start === "number") {
            command.push(start);
        }
        if (typeof end === "number") {
            command.push(end);
        }
        super(command, opts);
    }
};
// pkg/commands/bitfield.ts
var BitFieldCommand = class {
    constructor(args, client, opts, execOperation = (command)=>command.exec(this.client)){
        this.client = client;
        this.opts = opts;
        this.execOperation = execOperation;
        this.command = [
            "bitfield",
            ...args
        ];
    }
    chain(...args) {
        this.command.push(...args);
        return this;
    }
    get(...args) {
        return this.chain("get", ...args);
    }
    set(...args) {
        return this.chain("set", ...args);
    }
    incrby(...args) {
        return this.chain("incrby", ...args);
    }
    overflow(overflow) {
        return this.chain("overflow", overflow);
    }
    exec() {
        const command = new Command(this.command, this.opts);
        return this.execOperation(command);
    }
};
// pkg/commands/bitop.ts
var BitOpCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "bitop",
            ...cmd
        ], opts);
    }
};
// pkg/commands/bitpos.ts
var BitPosCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "bitpos",
            ...cmd
        ], opts);
    }
};
// pkg/commands/copy.ts
var CopyCommand = class extends Command {
    constructor([key, destinationKey, opts], commandOptions){
        super([
            "COPY",
            key,
            destinationKey,
            ...opts?.replace ? [
                "REPLACE"
            ] : []
        ], {
            ...commandOptions,
            deserialize (result) {
                if (result > 0) {
                    return "COPIED";
                }
                return "NOT_COPIED";
            }
        });
    }
};
// pkg/commands/dbsize.ts
var DBSizeCommand = class extends Command {
    constructor(opts){
        super([
            "dbsize"
        ], opts);
    }
};
// pkg/commands/decr.ts
var DecrCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "decr",
            ...cmd
        ], opts);
    }
};
// pkg/commands/decrby.ts
var DecrByCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "decrby",
            ...cmd
        ], opts);
    }
};
// pkg/commands/del.ts
var DelCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "del",
            ...cmd
        ], opts);
    }
};
// pkg/commands/echo.ts
var EchoCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "echo",
            ...cmd
        ], opts);
    }
};
// pkg/commands/eval.ts
var EvalCommand = class extends Command {
    constructor([script, keys, args], opts){
        super([
            "eval",
            script,
            keys.length,
            ...keys,
            ...args ?? []
        ], opts);
    }
};
// pkg/commands/evalsha.ts
var EvalshaCommand = class extends Command {
    constructor([sha, keys, args], opts){
        super([
            "evalsha",
            sha,
            keys.length,
            ...keys,
            ...args ?? []
        ], opts);
    }
};
// pkg/commands/exists.ts
var ExistsCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "exists",
            ...cmd
        ], opts);
    }
};
// pkg/commands/expire.ts
var ExpireCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "expire",
            ...cmd.filter(Boolean)
        ], opts);
    }
};
// pkg/commands/expireat.ts
var ExpireAtCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "expireat",
            ...cmd
        ], opts);
    }
};
// pkg/commands/flushall.ts
var FlushAllCommand = class extends Command {
    constructor(args, opts){
        const command = [
            "flushall"
        ];
        if (args && args.length > 0 && args[0].async) {
            command.push("async");
        }
        super(command, opts);
    }
};
// pkg/commands/flushdb.ts
var FlushDBCommand = class extends Command {
    constructor([opts], cmdOpts){
        const command = [
            "flushdb"
        ];
        if (opts?.async) {
            command.push("async");
        }
        super(command, cmdOpts);
    }
};
// pkg/commands/geo_add.ts
var GeoAddCommand = class extends Command {
    constructor([key, arg1, ...arg2], opts){
        const command = [
            "geoadd",
            key
        ];
        if ("nx" in arg1 && arg1.nx) {
            command.push("nx");
        } else if ("xx" in arg1 && arg1.xx) {
            command.push("xx");
        }
        if ("ch" in arg1 && arg1.ch) {
            command.push("ch");
        }
        if ("latitude" in arg1 && arg1.latitude) {
            command.push(arg1.longitude, arg1.latitude, arg1.member);
        }
        command.push(...arg2.flatMap(({ latitude, longitude, member })=>[
                longitude,
                latitude,
                member
            ]));
        super(command, opts);
    }
};
// pkg/commands/geo_dist.ts
var GeoDistCommand = class extends Command {
    constructor([key, member1, member2, unit = "M"], opts){
        super([
            "GEODIST",
            key,
            member1,
            member2,
            unit
        ], opts);
    }
};
// pkg/commands/geo_hash.ts
var GeoHashCommand = class extends Command {
    constructor(cmd, opts){
        const [key] = cmd;
        const members = Array.isArray(cmd[1]) ? cmd[1] : cmd.slice(1);
        super([
            "GEOHASH",
            key,
            ...members
        ], opts);
    }
};
// pkg/commands/geo_pos.ts
var GeoPosCommand = class extends Command {
    constructor(cmd, opts){
        const [key] = cmd;
        const members = Array.isArray(cmd[1]) ? cmd[1] : cmd.slice(1);
        super([
            "GEOPOS",
            key,
            ...members
        ], {
            deserialize: (result)=>transform(result),
            ...opts
        });
    }
};
function transform(result) {
    const final = [];
    for (const pos of result){
        if (!pos?.[0] || !pos?.[1]) {
            continue;
        }
        final.push({
            lng: Number.parseFloat(pos[0]),
            lat: Number.parseFloat(pos[1])
        });
    }
    return final;
}
// pkg/commands/geo_search.ts
var GeoSearchCommand = class extends Command {
    constructor([key, centerPoint, shape, order, opts], commandOptions){
        const command = [
            "GEOSEARCH",
            key
        ];
        if (centerPoint.type === "FROMMEMBER" || centerPoint.type === "frommember") {
            command.push(centerPoint.type, centerPoint.member);
        }
        if (centerPoint.type === "FROMLONLAT" || centerPoint.type === "fromlonlat") {
            command.push(centerPoint.type, centerPoint.coordinate.lon, centerPoint.coordinate.lat);
        }
        if (shape.type === "BYRADIUS" || shape.type === "byradius") {
            command.push(shape.type, shape.radius, shape.radiusType);
        }
        if (shape.type === "BYBOX" || shape.type === "bybox") {
            command.push(shape.type, shape.rect.width, shape.rect.height, shape.rectType);
        }
        command.push(order);
        if (opts?.count) {
            command.push("COUNT", opts.count.limit, ...opts.count.any ? [
                "ANY"
            ] : []);
        }
        const transform2 = (result)=>{
            if (!opts?.withCoord && !opts?.withDist && !opts?.withHash) {
                return result.map((member)=>{
                    try {
                        return {
                            member: JSON.parse(member)
                        };
                    } catch  {
                        return {
                            member
                        };
                    }
                });
            }
            return result.map((members)=>{
                let counter = 1;
                const obj = {};
                try {
                    obj.member = JSON.parse(members[0]);
                } catch  {
                    obj.member = members[0];
                }
                if (opts.withDist) {
                    obj.dist = Number.parseFloat(members[counter++]);
                }
                if (opts.withHash) {
                    obj.hash = members[counter++].toString();
                }
                if (opts.withCoord) {
                    obj.coord = {
                        long: Number.parseFloat(members[counter][0]),
                        lat: Number.parseFloat(members[counter][1])
                    };
                }
                return obj;
            });
        };
        super([
            ...command,
            ...opts?.withCoord ? [
                "WITHCOORD"
            ] : [],
            ...opts?.withDist ? [
                "WITHDIST"
            ] : [],
            ...opts?.withHash ? [
                "WITHHASH"
            ] : []
        ], {
            deserialize: transform2,
            ...commandOptions
        });
    }
};
// pkg/commands/geo_search_store.ts
var GeoSearchStoreCommand = class extends Command {
    constructor([destination, key, centerPoint, shape, order, opts], commandOptions){
        const command = [
            "GEOSEARCHSTORE",
            destination,
            key
        ];
        if (centerPoint.type === "FROMMEMBER" || centerPoint.type === "frommember") {
            command.push(centerPoint.type, centerPoint.member);
        }
        if (centerPoint.type === "FROMLONLAT" || centerPoint.type === "fromlonlat") {
            command.push(centerPoint.type, centerPoint.coordinate.lon, centerPoint.coordinate.lat);
        }
        if (shape.type === "BYRADIUS" || shape.type === "byradius") {
            command.push(shape.type, shape.radius, shape.radiusType);
        }
        if (shape.type === "BYBOX" || shape.type === "bybox") {
            command.push(shape.type, shape.rect.width, shape.rect.height, shape.rectType);
        }
        command.push(order);
        if (opts?.count) {
            command.push("COUNT", opts.count.limit, ...opts.count.any ? [
                "ANY"
            ] : []);
        }
        super([
            ...command,
            ...opts?.storeDist ? [
                "STOREDIST"
            ] : []
        ], commandOptions);
    }
};
// pkg/commands/get.ts
var GetCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "get",
            ...cmd
        ], opts);
    }
};
// pkg/commands/getbit.ts
var GetBitCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "getbit",
            ...cmd
        ], opts);
    }
};
// pkg/commands/getdel.ts
var GetDelCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "getdel",
            ...cmd
        ], opts);
    }
};
// pkg/commands/getrange.ts
var GetRangeCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "getrange",
            ...cmd
        ], opts);
    }
};
// pkg/commands/getset.ts
var GetSetCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "getset",
            ...cmd
        ], opts);
    }
};
// pkg/commands/hdel.ts
var HDelCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "hdel",
            ...cmd
        ], opts);
    }
};
// pkg/commands/hexists.ts
var HExistsCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "hexists",
            ...cmd
        ], opts);
    }
};
// pkg/commands/hget.ts
var HGetCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "hget",
            ...cmd
        ], opts);
    }
};
// pkg/commands/hgetall.ts
function deserialize2(result) {
    if (result.length === 0) {
        return null;
    }
    const obj = {};
    while(result.length >= 2){
        const key = result.shift();
        const value = result.shift();
        try {
            const valueIsNumberAndNotSafeInteger = !Number.isNaN(Number(value)) && !Number.isSafeInteger(Number(value));
            obj[key] = valueIsNumberAndNotSafeInteger ? value : JSON.parse(value);
        } catch  {
            obj[key] = value;
        }
    }
    return obj;
}
var HGetAllCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "hgetall",
            ...cmd
        ], {
            deserialize: (result)=>deserialize2(result),
            ...opts
        });
    }
};
// pkg/commands/hincrby.ts
var HIncrByCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "hincrby",
            ...cmd
        ], opts);
    }
};
// pkg/commands/hincrbyfloat.ts
var HIncrByFloatCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "hincrbyfloat",
            ...cmd
        ], opts);
    }
};
// pkg/commands/hkeys.ts
var HKeysCommand = class extends Command {
    constructor([key], opts){
        super([
            "hkeys",
            key
        ], opts);
    }
};
// pkg/commands/hlen.ts
var HLenCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "hlen",
            ...cmd
        ], opts);
    }
};
// pkg/commands/hmget.ts
function deserialize3(fields, result) {
    if (result.every((field)=>field === null)) {
        return null;
    }
    const obj = {};
    for (const [i, field] of fields.entries()){
        try {
            obj[field] = JSON.parse(result[i]);
        } catch  {
            obj[field] = result[i];
        }
    }
    return obj;
}
var HMGetCommand = class extends Command {
    constructor([key, ...fields], opts){
        super([
            "hmget",
            key,
            ...fields
        ], {
            deserialize: (result)=>deserialize3(fields, result),
            ...opts
        });
    }
};
// pkg/commands/hmset.ts
var HMSetCommand = class extends Command {
    constructor([key, kv], opts){
        super([
            "hmset",
            key,
            ...Object.entries(kv).flatMap(([field, value])=>[
                    field,
                    value
                ])
        ], opts);
    }
};
// pkg/commands/hscan.ts
var HScanCommand = class extends Command {
    constructor([key, cursor, cmdOpts], opts){
        const command = [
            "hscan",
            key,
            cursor
        ];
        if (cmdOpts?.match) {
            command.push("match", cmdOpts.match);
        }
        if (typeof cmdOpts?.count === "number") {
            command.push("count", cmdOpts.count);
        }
        super(command, {
            deserialize: deserializeScanResponse,
            ...opts
        });
    }
};
// pkg/commands/hset.ts
var HSetCommand = class extends Command {
    constructor([key, kv], opts){
        super([
            "hset",
            key,
            ...Object.entries(kv).flatMap(([field, value])=>[
                    field,
                    value
                ])
        ], opts);
    }
};
// pkg/commands/hsetnx.ts
var HSetNXCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "hsetnx",
            ...cmd
        ], opts);
    }
};
// pkg/commands/hstrlen.ts
var HStrLenCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "hstrlen",
            ...cmd
        ], opts);
    }
};
// pkg/commands/hvals.ts
var HValsCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "hvals",
            ...cmd
        ], opts);
    }
};
// pkg/commands/incr.ts
var IncrCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "incr",
            ...cmd
        ], opts);
    }
};
// pkg/commands/incrby.ts
var IncrByCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "incrby",
            ...cmd
        ], opts);
    }
};
// pkg/commands/incrbyfloat.ts
var IncrByFloatCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "incrbyfloat",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_arrappend.ts
var JsonArrAppendCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.ARRAPPEND",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_arrindex.ts
var JsonArrIndexCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.ARRINDEX",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_arrinsert.ts
var JsonArrInsertCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.ARRINSERT",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_arrlen.ts
var JsonArrLenCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.ARRLEN",
            cmd[0],
            cmd[1] ?? "$"
        ], opts);
    }
};
// pkg/commands/json_arrpop.ts
var JsonArrPopCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.ARRPOP",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_arrtrim.ts
var JsonArrTrimCommand = class extends Command {
    constructor(cmd, opts){
        const path = cmd[1] ?? "$";
        const start = cmd[2] ?? 0;
        const stop = cmd[3] ?? 0;
        super([
            "JSON.ARRTRIM",
            cmd[0],
            path,
            start,
            stop
        ], opts);
    }
};
// pkg/commands/json_clear.ts
var JsonClearCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.CLEAR",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_del.ts
var JsonDelCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.DEL",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_forget.ts
var JsonForgetCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.FORGET",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_get.ts
var JsonGetCommand = class extends Command {
    constructor(cmd, opts){
        const command = [
            "JSON.GET"
        ];
        if (typeof cmd[1] === "string") {
            command.push(...cmd);
        } else {
            command.push(cmd[0]);
            if (cmd[1]) {
                if (cmd[1].indent) {
                    command.push("INDENT", cmd[1].indent);
                }
                if (cmd[1].newline) {
                    command.push("NEWLINE", cmd[1].newline);
                }
                if (cmd[1].space) {
                    command.push("SPACE", cmd[1].space);
                }
            }
            command.push(...cmd.slice(2));
        }
        super(command, opts);
    }
};
// pkg/commands/json_mget.ts
var JsonMGetCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.MGET",
            ...cmd[0],
            cmd[1]
        ], opts);
    }
};
// pkg/commands/json_mset.ts
var JsonMSetCommand = class extends Command {
    constructor(cmd, opts){
        const command = [
            "JSON.MSET"
        ];
        for (const c of cmd){
            command.push(c.key, c.path, c.value);
        }
        super(command, opts);
    }
};
// pkg/commands/json_numincrby.ts
var JsonNumIncrByCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.NUMINCRBY",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_nummultby.ts
var JsonNumMultByCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.NUMMULTBY",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_objkeys.ts
var JsonObjKeysCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.OBJKEYS",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_objlen.ts
var JsonObjLenCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.OBJLEN",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_resp.ts
var JsonRespCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.RESP",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_set.ts
var JsonSetCommand = class extends Command {
    constructor(cmd, opts){
        const command = [
            "JSON.SET",
            cmd[0],
            cmd[1],
            cmd[2]
        ];
        if (cmd[3]) {
            if (cmd[3].nx) {
                command.push("NX");
            } else if (cmd[3].xx) {
                command.push("XX");
            }
        }
        super(command, opts);
    }
};
// pkg/commands/json_strappend.ts
var JsonStrAppendCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.STRAPPEND",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_strlen.ts
var JsonStrLenCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.STRLEN",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_toggle.ts
var JsonToggleCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.TOGGLE",
            ...cmd
        ], opts);
    }
};
// pkg/commands/json_type.ts
var JsonTypeCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "JSON.TYPE",
            ...cmd
        ], opts);
    }
};
// pkg/commands/keys.ts
var KeysCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "keys",
            ...cmd
        ], opts);
    }
};
// pkg/commands/lindex.ts
var LIndexCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "lindex",
            ...cmd
        ], opts);
    }
};
// pkg/commands/linsert.ts
var LInsertCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "linsert",
            ...cmd
        ], opts);
    }
};
// pkg/commands/llen.ts
var LLenCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "llen",
            ...cmd
        ], opts);
    }
};
// pkg/commands/lmove.ts
var LMoveCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "lmove",
            ...cmd
        ], opts);
    }
};
// pkg/commands/lmpop.ts
var LmPopCommand = class extends Command {
    constructor(cmd, opts){
        const [numkeys, keys, direction, count] = cmd;
        super([
            "LMPOP",
            numkeys,
            ...keys,
            direction,
            ...count ? [
                "COUNT",
                count
            ] : []
        ], opts);
    }
};
// pkg/commands/lpop.ts
var LPopCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "lpop",
            ...cmd
        ], opts);
    }
};
// pkg/commands/lpos.ts
var LPosCommand = class extends Command {
    constructor(cmd, opts){
        const args = [
            "lpos",
            cmd[0],
            cmd[1]
        ];
        if (typeof cmd[2]?.rank === "number") {
            args.push("rank", cmd[2].rank);
        }
        if (typeof cmd[2]?.count === "number") {
            args.push("count", cmd[2].count);
        }
        if (typeof cmd[2]?.maxLen === "number") {
            args.push("maxLen", cmd[2].maxLen);
        }
        super(args, opts);
    }
};
// pkg/commands/lpush.ts
var LPushCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "lpush",
            ...cmd
        ], opts);
    }
};
// pkg/commands/lpushx.ts
var LPushXCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "lpushx",
            ...cmd
        ], opts);
    }
};
// pkg/commands/lrange.ts
var LRangeCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "lrange",
            ...cmd
        ], opts);
    }
};
// pkg/commands/lrem.ts
var LRemCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "lrem",
            ...cmd
        ], opts);
    }
};
// pkg/commands/lset.ts
var LSetCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "lset",
            ...cmd
        ], opts);
    }
};
// pkg/commands/ltrim.ts
var LTrimCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "ltrim",
            ...cmd
        ], opts);
    }
};
// pkg/commands/mget.ts
var MGetCommand = class extends Command {
    constructor(cmd, opts){
        const keys = Array.isArray(cmd[0]) ? cmd[0] : cmd;
        super([
            "mget",
            ...keys
        ], opts);
    }
};
// pkg/commands/mset.ts
var MSetCommand = class extends Command {
    constructor([kv], opts){
        super([
            "mset",
            ...Object.entries(kv).flatMap(([key, value])=>[
                    key,
                    value
                ])
        ], opts);
    }
};
// pkg/commands/msetnx.ts
var MSetNXCommand = class extends Command {
    constructor([kv], opts){
        super([
            "msetnx",
            ...Object.entries(kv).flat()
        ], opts);
    }
};
// pkg/commands/persist.ts
var PersistCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "persist",
            ...cmd
        ], opts);
    }
};
// pkg/commands/pexpire.ts
var PExpireCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "pexpire",
            ...cmd
        ], opts);
    }
};
// pkg/commands/pexpireat.ts
var PExpireAtCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "pexpireat",
            ...cmd
        ], opts);
    }
};
// pkg/commands/pfadd.ts
var PfAddCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "pfadd",
            ...cmd
        ], opts);
    }
};
// pkg/commands/pfcount.ts
var PfCountCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "pfcount",
            ...cmd
        ], opts);
    }
};
// pkg/commands/pfmerge.ts
var PfMergeCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "pfmerge",
            ...cmd
        ], opts);
    }
};
// pkg/commands/ping.ts
var PingCommand = class extends Command {
    constructor(cmd, opts){
        const command = [
            "ping"
        ];
        if (cmd?.[0] !== void 0) {
            command.push(cmd[0]);
        }
        super(command, opts);
    }
};
// pkg/commands/psetex.ts
var PSetEXCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "psetex",
            ...cmd
        ], opts);
    }
};
// pkg/commands/pttl.ts
var PTtlCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "pttl",
            ...cmd
        ], opts);
    }
};
// pkg/commands/publish.ts
var PublishCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "publish",
            ...cmd
        ], opts);
    }
};
// pkg/commands/randomkey.ts
var RandomKeyCommand = class extends Command {
    constructor(opts){
        super([
            "randomkey"
        ], opts);
    }
};
// pkg/commands/rename.ts
var RenameCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "rename",
            ...cmd
        ], opts);
    }
};
// pkg/commands/renamenx.ts
var RenameNXCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "renamenx",
            ...cmd
        ], opts);
    }
};
// pkg/commands/rpop.ts
var RPopCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "rpop",
            ...cmd
        ], opts);
    }
};
// pkg/commands/rpush.ts
var RPushCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "rpush",
            ...cmd
        ], opts);
    }
};
// pkg/commands/rpushx.ts
var RPushXCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "rpushx",
            ...cmd
        ], opts);
    }
};
// pkg/commands/sadd.ts
var SAddCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "sadd",
            ...cmd
        ], opts);
    }
};
// pkg/commands/scan.ts
var ScanCommand = class extends Command {
    constructor([cursor, opts], cmdOpts){
        const command = [
            "scan",
            cursor
        ];
        if (opts?.match) {
            command.push("match", opts.match);
        }
        if (typeof opts?.count === "number") {
            command.push("count", opts.count);
        }
        if (opts?.type && opts.type.length > 0) {
            command.push("type", opts.type);
        }
        super(command, {
            deserialize: deserializeScanResponse,
            ...cmdOpts
        });
    }
};
// pkg/commands/scard.ts
var SCardCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "scard",
            ...cmd
        ], opts);
    }
};
// pkg/commands/script_exists.ts
var ScriptExistsCommand = class extends Command {
    constructor(hashes, opts){
        super([
            "script",
            "exists",
            ...hashes
        ], {
            deserialize: (result)=>result,
            ...opts
        });
    }
};
// pkg/commands/script_flush.ts
var ScriptFlushCommand = class extends Command {
    constructor([opts], cmdOpts){
        const cmd = [
            "script",
            "flush"
        ];
        if (opts?.sync) {
            cmd.push("sync");
        } else if (opts?.async) {
            cmd.push("async");
        }
        super(cmd, cmdOpts);
    }
};
// pkg/commands/script_load.ts
var ScriptLoadCommand = class extends Command {
    constructor(args, opts){
        super([
            "script",
            "load",
            ...args
        ], opts);
    }
};
// pkg/commands/sdiff.ts
var SDiffCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "sdiff",
            ...cmd
        ], opts);
    }
};
// pkg/commands/sdiffstore.ts
var SDiffStoreCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "sdiffstore",
            ...cmd
        ], opts);
    }
};
// pkg/commands/set.ts
var SetCommand = class extends Command {
    constructor([key, value, opts], cmdOpts){
        const command = [
            "set",
            key,
            value
        ];
        if (opts) {
            if ("nx" in opts && opts.nx) {
                command.push("nx");
            } else if ("xx" in opts && opts.xx) {
                command.push("xx");
            }
            if ("get" in opts && opts.get) {
                command.push("get");
            }
            if ("ex" in opts && typeof opts.ex === "number") {
                command.push("ex", opts.ex);
            } else if ("px" in opts && typeof opts.px === "number") {
                command.push("px", opts.px);
            } else if ("exat" in opts && typeof opts.exat === "number") {
                command.push("exat", opts.exat);
            } else if ("pxat" in opts && typeof opts.pxat === "number") {
                command.push("pxat", opts.pxat);
            } else if ("keepTtl" in opts && opts.keepTtl) {
                command.push("keepTtl");
            }
        }
        super(command, cmdOpts);
    }
};
// pkg/commands/setbit.ts
var SetBitCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "setbit",
            ...cmd
        ], opts);
    }
};
// pkg/commands/setex.ts
var SetExCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "setex",
            ...cmd
        ], opts);
    }
};
// pkg/commands/setnx.ts
var SetNxCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "setnx",
            ...cmd
        ], opts);
    }
};
// pkg/commands/setrange.ts
var SetRangeCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "setrange",
            ...cmd
        ], opts);
    }
};
// pkg/commands/sinter.ts
var SInterCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "sinter",
            ...cmd
        ], opts);
    }
};
// pkg/commands/sinterstore.ts
var SInterStoreCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "sinterstore",
            ...cmd
        ], opts);
    }
};
// pkg/commands/sismember.ts
var SIsMemberCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "sismember",
            ...cmd
        ], opts);
    }
};
// pkg/commands/smembers.ts
var SMembersCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "smembers",
            ...cmd
        ], opts);
    }
};
// pkg/commands/smismember.ts
var SMIsMemberCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "smismember",
            cmd[0],
            ...cmd[1]
        ], opts);
    }
};
// pkg/commands/smove.ts
var SMoveCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "smove",
            ...cmd
        ], opts);
    }
};
// pkg/commands/spop.ts
var SPopCommand = class extends Command {
    constructor([key, count], opts){
        const command = [
            "spop",
            key
        ];
        if (typeof count === "number") {
            command.push(count);
        }
        super(command, opts);
    }
};
// pkg/commands/srandmember.ts
var SRandMemberCommand = class extends Command {
    constructor([key, count], opts){
        const command = [
            "srandmember",
            key
        ];
        if (typeof count === "number") {
            command.push(count);
        }
        super(command, opts);
    }
};
// pkg/commands/srem.ts
var SRemCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "srem",
            ...cmd
        ], opts);
    }
};
// pkg/commands/sscan.ts
var SScanCommand = class extends Command {
    constructor([key, cursor, opts], cmdOpts){
        const command = [
            "sscan",
            key,
            cursor
        ];
        if (opts?.match) {
            command.push("match", opts.match);
        }
        if (typeof opts?.count === "number") {
            command.push("count", opts.count);
        }
        super(command, {
            deserialize: deserializeScanResponse,
            ...cmdOpts
        });
    }
};
// pkg/commands/strlen.ts
var StrLenCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "strlen",
            ...cmd
        ], opts);
    }
};
// pkg/commands/sunion.ts
var SUnionCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "sunion",
            ...cmd
        ], opts);
    }
};
// pkg/commands/sunionstore.ts
var SUnionStoreCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "sunionstore",
            ...cmd
        ], opts);
    }
};
// pkg/commands/time.ts
var TimeCommand = class extends Command {
    constructor(opts){
        super([
            "time"
        ], opts);
    }
};
// pkg/commands/touch.ts
var TouchCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "touch",
            ...cmd
        ], opts);
    }
};
// pkg/commands/ttl.ts
var TtlCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "ttl",
            ...cmd
        ], opts);
    }
};
// pkg/commands/type.ts
var TypeCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "type",
            ...cmd
        ], opts);
    }
};
// pkg/commands/unlink.ts
var UnlinkCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "unlink",
            ...cmd
        ], opts);
    }
};
// pkg/commands/xack.ts
var XAckCommand = class extends Command {
    constructor([key, group, id], opts){
        const ids = Array.isArray(id) ? [
            ...id
        ] : [
            id
        ];
        super([
            "XACK",
            key,
            group,
            ...ids
        ], opts);
    }
};
// pkg/commands/xadd.ts
var XAddCommand = class extends Command {
    constructor([key, id, entries, opts], commandOptions){
        const command = [
            "XADD",
            key
        ];
        if (opts) {
            if (opts.nomkStream) {
                command.push("NOMKSTREAM");
            }
            if (opts.trim) {
                command.push(opts.trim.type, opts.trim.comparison, opts.trim.threshold);
                if (opts.trim.limit !== void 0) {
                    command.push("LIMIT", opts.trim.limit);
                }
            }
        }
        command.push(id);
        for (const [k, v] of Object.entries(entries)){
            command.push(k, v);
        }
        super(command, commandOptions);
    }
};
// pkg/commands/xautoclaim.ts
var XAutoClaim = class extends Command {
    constructor([key, group, consumer, minIdleTime, start, options], opts){
        const commands = [];
        if (options?.count) {
            commands.push("COUNT", options.count);
        }
        if (options?.justId) {
            commands.push("JUSTID");
        }
        super([
            "XAUTOCLAIM",
            key,
            group,
            consumer,
            minIdleTime,
            start,
            ...commands
        ], opts);
    }
};
// pkg/commands/xclaim.ts
var XClaimCommand = class extends Command {
    constructor([key, group, consumer, minIdleTime, id, options], opts){
        const ids = Array.isArray(id) ? [
            ...id
        ] : [
            id
        ];
        const commands = [];
        if (options?.idleMS) {
            commands.push("IDLE", options.idleMS);
        }
        if (options?.idleMS) {
            commands.push("TIME", options.timeMS);
        }
        if (options?.retryCount) {
            commands.push("RETRYCOUNT", options.retryCount);
        }
        if (options?.force) {
            commands.push("FORCE");
        }
        if (options?.justId) {
            commands.push("JUSTID");
        }
        if (options?.lastId) {
            commands.push("LASTID", options.lastId);
        }
        super([
            "XCLAIM",
            key,
            group,
            consumer,
            minIdleTime,
            ...ids,
            ...commands
        ], opts);
    }
};
// pkg/commands/xdel.ts
var XDelCommand = class extends Command {
    constructor([key, ids], opts){
        const cmds = Array.isArray(ids) ? [
            ...ids
        ] : [
            ids
        ];
        super([
            "XDEL",
            key,
            ...cmds
        ], opts);
    }
};
// pkg/commands/xgroup.ts
var XGroupCommand = class extends Command {
    constructor([key, opts], commandOptions){
        const command = [
            "XGROUP"
        ];
        switch(opts.type){
            case "CREATE":
                {
                    command.push("CREATE", key, opts.group, opts.id);
                    if (opts.options) {
                        if (opts.options.MKSTREAM) {
                            command.push("MKSTREAM");
                        }
                        if (opts.options.ENTRIESREAD !== void 0) {
                            command.push("ENTRIESREAD", opts.options.ENTRIESREAD.toString());
                        }
                    }
                    break;
                }
            case "CREATECONSUMER":
                {
                    command.push("CREATECONSUMER", key, opts.group, opts.consumer);
                    break;
                }
            case "DELCONSUMER":
                {
                    command.push("DELCONSUMER", key, opts.group, opts.consumer);
                    break;
                }
            case "DESTROY":
                {
                    command.push("DESTROY", key, opts.group);
                    break;
                }
            case "SETID":
                {
                    command.push("SETID", key, opts.group, opts.id);
                    if (opts.options?.ENTRIESREAD !== void 0) {
                        command.push("ENTRIESREAD", opts.options.ENTRIESREAD.toString());
                    }
                    break;
                }
            default:
                {
                    throw new Error("Invalid XGROUP");
                }
        }
        super(command, commandOptions);
    }
};
// pkg/commands/xinfo.ts
var XInfoCommand = class extends Command {
    constructor([key, options], opts){
        const cmds = [];
        if (options.type === "CONSUMERS") {
            cmds.push("CONSUMERS", key, options.group);
        } else {
            cmds.push("GROUPS", key);
        }
        super([
            "XINFO",
            ...cmds
        ], opts);
    }
};
// pkg/commands/xlen.ts
var XLenCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "XLEN",
            ...cmd
        ], opts);
    }
};
// pkg/commands/xpending.ts
var XPendingCommand = class extends Command {
    constructor([key, group, start, end, count, options], opts){
        const consumers = options?.consumer === void 0 ? [] : Array.isArray(options.consumer) ? [
            ...options.consumer
        ] : [
            options.consumer
        ];
        super([
            "XPENDING",
            key,
            group,
            ...options?.idleTime ? [
                "IDLE",
                options.idleTime
            ] : [],
            start,
            end,
            count,
            ...consumers
        ], opts);
    }
};
// pkg/commands/xrange.ts
function deserialize4(result) {
    const obj = {};
    for (const e of result){
        while(e.length >= 2){
            const streamId = e.shift();
            const entries = e.shift();
            if (!(streamId in obj)) {
                obj[streamId] = {};
            }
            while(entries.length >= 2){
                const field = entries.shift();
                const value = entries.shift();
                try {
                    obj[streamId][field] = JSON.parse(value);
                } catch  {
                    obj[streamId][field] = value;
                }
            }
        }
    }
    return obj;
}
var XRangeCommand = class extends Command {
    constructor([key, start, end, count], opts){
        const command = [
            "XRANGE",
            key,
            start,
            end
        ];
        if (typeof count === "number") {
            command.push("COUNT", count);
        }
        super(command, {
            deserialize: (result)=>deserialize4(result),
            ...opts
        });
    }
};
// pkg/commands/xread.ts
var UNBALANCED_XREAD_ERR = "ERR Unbalanced XREAD list of streams: for each stream key an ID or '$' must be specified";
var XReadCommand = class extends Command {
    constructor([key, id, options], opts){
        if (Array.isArray(key) && Array.isArray(id) && key.length !== id.length) {
            throw new Error(UNBALANCED_XREAD_ERR);
        }
        const commands = [];
        if (typeof options?.count === "number") {
            commands.push("COUNT", options.count);
        }
        if (typeof options?.blockMS === "number") {
            commands.push("BLOCK", options.blockMS);
        }
        commands.push("STREAMS", ...Array.isArray(key) ? [
            ...key
        ] : [
            key
        ], ...Array.isArray(id) ? [
            ...id
        ] : [
            id
        ]);
        super([
            "XREAD",
            ...commands
        ], opts);
    }
};
// pkg/commands/xreadgroup.ts
var UNBALANCED_XREADGROUP_ERR = "ERR Unbalanced XREADGROUP list of streams: for each stream key an ID or '$' must be specified";
var XReadGroupCommand = class extends Command {
    constructor([group, consumer, key, id, options], opts){
        if (Array.isArray(key) && Array.isArray(id) && key.length !== id.length) {
            throw new Error(UNBALANCED_XREADGROUP_ERR);
        }
        const commands = [];
        if (typeof options?.count === "number") {
            commands.push("COUNT", options.count);
        }
        if (typeof options?.blockMS === "number") {
            commands.push("BLOCK", options.blockMS);
        }
        if (typeof options?.NOACK === "boolean" && options.NOACK) {
            commands.push("NOACK");
        }
        commands.push("STREAMS", ...Array.isArray(key) ? [
            ...key
        ] : [
            key
        ], ...Array.isArray(id) ? [
            ...id
        ] : [
            id
        ]);
        super([
            "XREADGROUP",
            "GROUP",
            group,
            consumer,
            ...commands
        ], opts);
    }
};
// pkg/commands/xrevrange.ts
var XRevRangeCommand = class extends Command {
    constructor([key, end, start, count], opts){
        const command = [
            "XREVRANGE",
            key,
            end,
            start
        ];
        if (typeof count === "number") {
            command.push("COUNT", count);
        }
        super(command, {
            deserialize: (result)=>deserialize5(result),
            ...opts
        });
    }
};
function deserialize5(result) {
    const obj = {};
    for (const e of result){
        while(e.length >= 2){
            const streamId = e.shift();
            const entries = e.shift();
            if (!(streamId in obj)) {
                obj[streamId] = {};
            }
            while(entries.length >= 2){
                const field = entries.shift();
                const value = entries.shift();
                try {
                    obj[streamId][field] = JSON.parse(value);
                } catch  {
                    obj[streamId][field] = value;
                }
            }
        }
    }
    return obj;
}
// pkg/commands/xtrim.ts
var XTrimCommand = class extends Command {
    constructor([key, options], opts){
        const { limit, strategy, threshold, exactness = "~" } = options;
        super([
            "XTRIM",
            key,
            strategy,
            exactness,
            threshold,
            ...limit ? [
                "LIMIT",
                limit
            ] : []
        ], opts);
    }
};
// pkg/commands/zadd.ts
var ZAddCommand = class extends Command {
    constructor([key, arg1, ...arg2], opts){
        const command = [
            "zadd",
            key
        ];
        if ("nx" in arg1 && arg1.nx) {
            command.push("nx");
        } else if ("xx" in arg1 && arg1.xx) {
            command.push("xx");
        }
        if ("ch" in arg1 && arg1.ch) {
            command.push("ch");
        }
        if ("incr" in arg1 && arg1.incr) {
            command.push("incr");
        }
        if ("lt" in arg1 && arg1.lt) {
            command.push("lt");
        } else if ("gt" in arg1 && arg1.gt) {
            command.push("gt");
        }
        if ("score" in arg1 && "member" in arg1) {
            command.push(arg1.score, arg1.member);
        }
        command.push(...arg2.flatMap(({ score, member })=>[
                score,
                member
            ]));
        super(command, opts);
    }
};
// pkg/commands/zcard.ts
var ZCardCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "zcard",
            ...cmd
        ], opts);
    }
};
// pkg/commands/zcount.ts
var ZCountCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "zcount",
            ...cmd
        ], opts);
    }
};
// pkg/commands/zincrby.ts
var ZIncrByCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "zincrby",
            ...cmd
        ], opts);
    }
};
// pkg/commands/zinterstore.ts
var ZInterStoreCommand = class extends Command {
    constructor([destination, numKeys, keyOrKeys, opts], cmdOpts){
        const command = [
            "zinterstore",
            destination,
            numKeys
        ];
        if (Array.isArray(keyOrKeys)) {
            command.push(...keyOrKeys);
        } else {
            command.push(keyOrKeys);
        }
        if (opts) {
            if ("weights" in opts && opts.weights) {
                command.push("weights", ...opts.weights);
            } else if ("weight" in opts && typeof opts.weight === "number") {
                command.push("weights", opts.weight);
            }
            if ("aggregate" in opts) {
                command.push("aggregate", opts.aggregate);
            }
        }
        super(command, cmdOpts);
    }
};
// pkg/commands/zlexcount.ts
var ZLexCountCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "zlexcount",
            ...cmd
        ], opts);
    }
};
// pkg/commands/zpopmax.ts
var ZPopMaxCommand = class extends Command {
    constructor([key, count], opts){
        const command = [
            "zpopmax",
            key
        ];
        if (typeof count === "number") {
            command.push(count);
        }
        super(command, opts);
    }
};
// pkg/commands/zpopmin.ts
var ZPopMinCommand = class extends Command {
    constructor([key, count], opts){
        const command = [
            "zpopmin",
            key
        ];
        if (typeof count === "number") {
            command.push(count);
        }
        super(command, opts);
    }
};
// pkg/commands/zrange.ts
var ZRangeCommand = class extends Command {
    constructor([key, min, max, opts], cmdOpts){
        const command = [
            "zrange",
            key,
            min,
            max
        ];
        if (opts?.byScore) {
            command.push("byscore");
        }
        if (opts?.byLex) {
            command.push("bylex");
        }
        if (opts?.rev) {
            command.push("rev");
        }
        if (opts?.count !== void 0 && opts.offset !== void 0) {
            command.push("limit", opts.offset, opts.count);
        }
        if (opts?.withScores) {
            command.push("withscores");
        }
        super(command, cmdOpts);
    }
};
// pkg/commands/zrank.ts
var ZRankCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "zrank",
            ...cmd
        ], opts);
    }
};
// pkg/commands/zrem.ts
var ZRemCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "zrem",
            ...cmd
        ], opts);
    }
};
// pkg/commands/zremrangebylex.ts
var ZRemRangeByLexCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "zremrangebylex",
            ...cmd
        ], opts);
    }
};
// pkg/commands/zremrangebyrank.ts
var ZRemRangeByRankCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "zremrangebyrank",
            ...cmd
        ], opts);
    }
};
// pkg/commands/zremrangebyscore.ts
var ZRemRangeByScoreCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "zremrangebyscore",
            ...cmd
        ], opts);
    }
};
// pkg/commands/zrevrank.ts
var ZRevRankCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "zrevrank",
            ...cmd
        ], opts);
    }
};
// pkg/commands/zscan.ts
var ZScanCommand = class extends Command {
    constructor([key, cursor, opts], cmdOpts){
        const command = [
            "zscan",
            key,
            cursor
        ];
        if (opts?.match) {
            command.push("match", opts.match);
        }
        if (typeof opts?.count === "number") {
            command.push("count", opts.count);
        }
        super(command, {
            deserialize: deserializeScanResponse,
            ...cmdOpts
        });
    }
};
// pkg/commands/zscore.ts
var ZScoreCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "zscore",
            ...cmd
        ], opts);
    }
};
// pkg/commands/zunion.ts
var ZUnionCommand = class extends Command {
    constructor([numKeys, keyOrKeys, opts], cmdOpts){
        const command = [
            "zunion",
            numKeys
        ];
        if (Array.isArray(keyOrKeys)) {
            command.push(...keyOrKeys);
        } else {
            command.push(keyOrKeys);
        }
        if (opts) {
            if ("weights" in opts && opts.weights) {
                command.push("weights", ...opts.weights);
            } else if ("weight" in opts && typeof opts.weight === "number") {
                command.push("weights", opts.weight);
            }
            if ("aggregate" in opts) {
                command.push("aggregate", opts.aggregate);
            }
            if (opts.withScores) {
                command.push("withscores");
            }
        }
        super(command, cmdOpts);
    }
};
// pkg/commands/zunionstore.ts
var ZUnionStoreCommand = class extends Command {
    constructor([destination, numKeys, keyOrKeys, opts], cmdOpts){
        const command = [
            "zunionstore",
            destination,
            numKeys
        ];
        if (Array.isArray(keyOrKeys)) {
            command.push(...keyOrKeys);
        } else {
            command.push(keyOrKeys);
        }
        if (opts) {
            if ("weights" in opts && opts.weights) {
                command.push("weights", ...opts.weights);
            } else if ("weight" in opts && typeof opts.weight === "number") {
                command.push("weights", opts.weight);
            }
            if ("aggregate" in opts) {
                command.push("aggregate", opts.aggregate);
            }
        }
        super(command, cmdOpts);
    }
};
// pkg/commands/zdiffstore.ts
var ZDiffStoreCommand = class extends Command {
    constructor(cmd, opts){
        super([
            "zdiffstore",
            ...cmd
        ], opts);
    }
};
// pkg/commands/zmscore.ts
var ZMScoreCommand = class extends Command {
    constructor(cmd, opts){
        const [key, members] = cmd;
        super([
            "zmscore",
            key,
            ...members
        ], opts);
    }
};
// pkg/pipeline.ts
var Pipeline = class {
    constructor(opts){
        this.exec = async (options)=>{
            if (this.commands.length === 0) {
                throw new Error("Pipeline is empty");
            }
            const path = this.multiExec ? [
                "multi-exec"
            ] : [
                "pipeline"
            ];
            const res = await this.client.request({
                path,
                body: Object.values(this.commands).map((c)=>c.command)
            });
            return options?.keepErrors ? res.map(({ error, result }, i)=>{
                return {
                    error,
                    result: this.commands[i].deserialize(result)
                };
            }) : res.map(({ error, result }, i)=>{
                if (error) {
                    throw new UpstashError(`Command ${i + 1} [ ${this.commands[i].command[0]} ] failed: ${error}`);
                }
                return this.commands[i].deserialize(result);
            });
        };
        /**
   * @see https://redis.io/commands/append
   */ this.append = (...args)=>this.chain(new AppendCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/bitcount
   */ this.bitcount = (...args)=>this.chain(new BitCountCommand(args, this.commandOptions));
        /**
   * Returns an instance that can be used to execute `BITFIELD` commands on one key.
   *
   * @example
   * ```typescript
   * redis.set("mykey", 0);
   * const result = await redis.pipeline()
   *   .bitfield("mykey")
   *   .set("u4", 0, 16)
   *   .incr("u4", "#1", 1)
   *   .exec();
   * console.log(result); // [[0, 1]]
   * ```
   *
   * @see https://redis.io/commands/bitfield
   */ this.bitfield = (...args)=>new BitFieldCommand(args, this.client, this.commandOptions, this.chain.bind(this));
        /**
   * @see https://redis.io/commands/bitop
   */ this.bitop = (op, destinationKey, sourceKey, ...sourceKeys)=>this.chain(new BitOpCommand([
                op,
                destinationKey,
                sourceKey,
                ...sourceKeys
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/bitpos
   */ this.bitpos = (...args)=>this.chain(new BitPosCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/copy
   */ this.copy = (...args)=>this.chain(new CopyCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zdiffstore
   */ this.zdiffstore = (...args)=>this.chain(new ZDiffStoreCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/dbsize
   */ this.dbsize = ()=>this.chain(new DBSizeCommand(this.commandOptions));
        /**
   * @see https://redis.io/commands/decr
   */ this.decr = (...args)=>this.chain(new DecrCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/decrby
   */ this.decrby = (...args)=>this.chain(new DecrByCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/del
   */ this.del = (...args)=>this.chain(new DelCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/echo
   */ this.echo = (...args)=>this.chain(new EchoCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/eval
   */ this.eval = (...args)=>this.chain(new EvalCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/evalsha
   */ this.evalsha = (...args)=>this.chain(new EvalshaCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/exists
   */ this.exists = (...args)=>this.chain(new ExistsCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/expire
   */ this.expire = (...args)=>this.chain(new ExpireCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/expireat
   */ this.expireat = (...args)=>this.chain(new ExpireAtCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/flushall
   */ this.flushall = (args)=>this.chain(new FlushAllCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/flushdb
   */ this.flushdb = (...args)=>this.chain(new FlushDBCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/geoadd
   */ this.geoadd = (...args)=>this.chain(new GeoAddCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/geodist
   */ this.geodist = (...args)=>this.chain(new GeoDistCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/geopos
   */ this.geopos = (...args)=>this.chain(new GeoPosCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/geohash
   */ this.geohash = (...args)=>this.chain(new GeoHashCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/geosearch
   */ this.geosearch = (...args)=>this.chain(new GeoSearchCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/geosearchstore
   */ this.geosearchstore = (...args)=>this.chain(new GeoSearchStoreCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/get
   */ this.get = (...args)=>this.chain(new GetCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/getbit
   */ this.getbit = (...args)=>this.chain(new GetBitCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/getdel
   */ this.getdel = (...args)=>this.chain(new GetDelCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/getrange
   */ this.getrange = (...args)=>this.chain(new GetRangeCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/getset
   */ this.getset = (key, value)=>this.chain(new GetSetCommand([
                key,
                value
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/hdel
   */ this.hdel = (...args)=>this.chain(new HDelCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/hexists
   */ this.hexists = (...args)=>this.chain(new HExistsCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/hget
   */ this.hget = (...args)=>this.chain(new HGetCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/hgetall
   */ this.hgetall = (...args)=>this.chain(new HGetAllCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/hincrby
   */ this.hincrby = (...args)=>this.chain(new HIncrByCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/hincrbyfloat
   */ this.hincrbyfloat = (...args)=>this.chain(new HIncrByFloatCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/hkeys
   */ this.hkeys = (...args)=>this.chain(new HKeysCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/hlen
   */ this.hlen = (...args)=>this.chain(new HLenCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/hmget
   */ this.hmget = (...args)=>this.chain(new HMGetCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/hmset
   */ this.hmset = (key, kv)=>this.chain(new HMSetCommand([
                key,
                kv
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/hrandfield
   */ this.hrandfield = (key, count, withValues)=>this.chain(new HRandFieldCommand([
                key,
                count,
                withValues
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/hscan
   */ this.hscan = (...args)=>this.chain(new HScanCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/hset
   */ this.hset = (key, kv)=>this.chain(new HSetCommand([
                key,
                kv
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/hsetnx
   */ this.hsetnx = (key, field, value)=>this.chain(new HSetNXCommand([
                key,
                field,
                value
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/hstrlen
   */ this.hstrlen = (...args)=>this.chain(new HStrLenCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/hvals
   */ this.hvals = (...args)=>this.chain(new HValsCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/incr
   */ this.incr = (...args)=>this.chain(new IncrCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/incrby
   */ this.incrby = (...args)=>this.chain(new IncrByCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/incrbyfloat
   */ this.incrbyfloat = (...args)=>this.chain(new IncrByFloatCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/keys
   */ this.keys = (...args)=>this.chain(new KeysCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/lindex
   */ this.lindex = (...args)=>this.chain(new LIndexCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/linsert
   */ this.linsert = (key, direction, pivot, value)=>this.chain(new LInsertCommand([
                key,
                direction,
                pivot,
                value
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/llen
   */ this.llen = (...args)=>this.chain(new LLenCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/lmove
   */ this.lmove = (...args)=>this.chain(new LMoveCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/lpop
   */ this.lpop = (...args)=>this.chain(new LPopCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/lmpop
   */ this.lmpop = (...args)=>this.chain(new LmPopCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/lpos
   */ this.lpos = (...args)=>this.chain(new LPosCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/lpush
   */ this.lpush = (key, ...elements)=>this.chain(new LPushCommand([
                key,
                ...elements
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/lpushx
   */ this.lpushx = (key, ...elements)=>this.chain(new LPushXCommand([
                key,
                ...elements
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/lrange
   */ this.lrange = (...args)=>this.chain(new LRangeCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/lrem
   */ this.lrem = (key, count, value)=>this.chain(new LRemCommand([
                key,
                count,
                value
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/lset
   */ this.lset = (key, index, value)=>this.chain(new LSetCommand([
                key,
                index,
                value
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/ltrim
   */ this.ltrim = (...args)=>this.chain(new LTrimCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/mget
   */ this.mget = (...args)=>this.chain(new MGetCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/mset
   */ this.mset = (kv)=>this.chain(new MSetCommand([
                kv
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/msetnx
   */ this.msetnx = (kv)=>this.chain(new MSetNXCommand([
                kv
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/persist
   */ this.persist = (...args)=>this.chain(new PersistCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/pexpire
   */ this.pexpire = (...args)=>this.chain(new PExpireCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/pexpireat
   */ this.pexpireat = (...args)=>this.chain(new PExpireAtCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/pfadd
   */ this.pfadd = (...args)=>this.chain(new PfAddCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/pfcount
   */ this.pfcount = (...args)=>this.chain(new PfCountCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/pfmerge
   */ this.pfmerge = (...args)=>this.chain(new PfMergeCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/ping
   */ this.ping = (args)=>this.chain(new PingCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/psetex
   */ this.psetex = (key, ttl, value)=>this.chain(new PSetEXCommand([
                key,
                ttl,
                value
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/pttl
   */ this.pttl = (...args)=>this.chain(new PTtlCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/publish
   */ this.publish = (...args)=>this.chain(new PublishCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/randomkey
   */ this.randomkey = ()=>this.chain(new RandomKeyCommand(this.commandOptions));
        /**
   * @see https://redis.io/commands/rename
   */ this.rename = (...args)=>this.chain(new RenameCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/renamenx
   */ this.renamenx = (...args)=>this.chain(new RenameNXCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/rpop
   */ this.rpop = (...args)=>this.chain(new RPopCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/rpush
   */ this.rpush = (key, ...elements)=>this.chain(new RPushCommand([
                key,
                ...elements
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/rpushx
   */ this.rpushx = (key, ...elements)=>this.chain(new RPushXCommand([
                key,
                ...elements
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/sadd
   */ this.sadd = (key, member, ...members)=>this.chain(new SAddCommand([
                key,
                member,
                ...members
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/scan
   */ this.scan = (...args)=>this.chain(new ScanCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/scard
   */ this.scard = (...args)=>this.chain(new SCardCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/script-exists
   */ this.scriptExists = (...args)=>this.chain(new ScriptExistsCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/script-flush
   */ this.scriptFlush = (...args)=>this.chain(new ScriptFlushCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/script-load
   */ this.scriptLoad = (...args)=>this.chain(new ScriptLoadCommand(args, this.commandOptions));
        /*)*
   * @see https://redis.io/commands/sdiff
   */ this.sdiff = (...args)=>this.chain(new SDiffCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/sdiffstore
   */ this.sdiffstore = (...args)=>this.chain(new SDiffStoreCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/set
   */ this.set = (key, value, opts)=>this.chain(new SetCommand([
                key,
                value,
                opts
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/setbit
   */ this.setbit = (...args)=>this.chain(new SetBitCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/setex
   */ this.setex = (key, ttl, value)=>this.chain(new SetExCommand([
                key,
                ttl,
                value
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/setnx
   */ this.setnx = (key, value)=>this.chain(new SetNxCommand([
                key,
                value
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/setrange
   */ this.setrange = (...args)=>this.chain(new SetRangeCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/sinter
   */ this.sinter = (...args)=>this.chain(new SInterCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/sinterstore
   */ this.sinterstore = (...args)=>this.chain(new SInterStoreCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/sismember
   */ this.sismember = (key, member)=>this.chain(new SIsMemberCommand([
                key,
                member
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/smembers
   */ this.smembers = (...args)=>this.chain(new SMembersCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/smismember
   */ this.smismember = (key, members)=>this.chain(new SMIsMemberCommand([
                key,
                members
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/smove
   */ this.smove = (source, destination, member)=>this.chain(new SMoveCommand([
                source,
                destination,
                member
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/spop
   */ this.spop = (...args)=>this.chain(new SPopCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/srandmember
   */ this.srandmember = (...args)=>this.chain(new SRandMemberCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/srem
   */ this.srem = (key, ...members)=>this.chain(new SRemCommand([
                key,
                ...members
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/sscan
   */ this.sscan = (...args)=>this.chain(new SScanCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/strlen
   */ this.strlen = (...args)=>this.chain(new StrLenCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/sunion
   */ this.sunion = (...args)=>this.chain(new SUnionCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/sunionstore
   */ this.sunionstore = (...args)=>this.chain(new SUnionStoreCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/time
   */ this.time = ()=>this.chain(new TimeCommand(this.commandOptions));
        /**
   * @see https://redis.io/commands/touch
   */ this.touch = (...args)=>this.chain(new TouchCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/ttl
   */ this.ttl = (...args)=>this.chain(new TtlCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/type
   */ this.type = (...args)=>this.chain(new TypeCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/unlink
   */ this.unlink = (...args)=>this.chain(new UnlinkCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zadd
   */ this.zadd = (...args)=>{
            if ("score" in args[1]) {
                return this.chain(new ZAddCommand([
                    args[0],
                    args[1],
                    ...args.slice(2)
                ], this.commandOptions));
            }
            return this.chain(new ZAddCommand([
                args[0],
                args[1],
                ...args.slice(2)
            ], this.commandOptions));
        };
        /**
   * @see https://redis.io/commands/xadd
   */ this.xadd = (...args)=>this.chain(new XAddCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/xack
   */ this.xack = (...args)=>this.chain(new XAckCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/xdel
   */ this.xdel = (...args)=>this.chain(new XDelCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/xgroup
   */ this.xgroup = (...args)=>this.chain(new XGroupCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/xread
   */ this.xread = (...args)=>this.chain(new XReadCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/xreadgroup
   */ this.xreadgroup = (...args)=>this.chain(new XReadGroupCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/xinfo
   */ this.xinfo = (...args)=>this.chain(new XInfoCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/xlen
   */ this.xlen = (...args)=>this.chain(new XLenCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/xpending
   */ this.xpending = (...args)=>this.chain(new XPendingCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/xclaim
   */ this.xclaim = (...args)=>this.chain(new XClaimCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/xautoclaim
   */ this.xautoclaim = (...args)=>this.chain(new XAutoClaim(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/xtrim
   */ this.xtrim = (...args)=>this.chain(new XTrimCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/xrange
   */ this.xrange = (...args)=>this.chain(new XRangeCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/xrevrange
   */ this.xrevrange = (...args)=>this.chain(new XRevRangeCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zcard
   */ this.zcard = (...args)=>this.chain(new ZCardCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zcount
   */ this.zcount = (...args)=>this.chain(new ZCountCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zincrby
   */ this.zincrby = (key, increment, member)=>this.chain(new ZIncrByCommand([
                key,
                increment,
                member
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/zinterstore
   */ this.zinterstore = (...args)=>this.chain(new ZInterStoreCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zlexcount
   */ this.zlexcount = (...args)=>this.chain(new ZLexCountCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zmscore
   */ this.zmscore = (...args)=>this.chain(new ZMScoreCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zpopmax
   */ this.zpopmax = (...args)=>this.chain(new ZPopMaxCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zpopmin
   */ this.zpopmin = (...args)=>this.chain(new ZPopMinCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zrange
   */ this.zrange = (...args)=>this.chain(new ZRangeCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zrank
   */ this.zrank = (key, member)=>this.chain(new ZRankCommand([
                key,
                member
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/zrem
   */ this.zrem = (key, ...members)=>this.chain(new ZRemCommand([
                key,
                ...members
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/zremrangebylex
   */ this.zremrangebylex = (...args)=>this.chain(new ZRemRangeByLexCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zremrangebyrank
   */ this.zremrangebyrank = (...args)=>this.chain(new ZRemRangeByRankCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zremrangebyscore
   */ this.zremrangebyscore = (...args)=>this.chain(new ZRemRangeByScoreCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zrevrank
   */ this.zrevrank = (key, member)=>this.chain(new ZRevRankCommand([
                key,
                member
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/zscan
   */ this.zscan = (...args)=>this.chain(new ZScanCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zscore
   */ this.zscore = (key, member)=>this.chain(new ZScoreCommand([
                key,
                member
            ], this.commandOptions));
        /**
   * @see https://redis.io/commands/zunionstore
   */ this.zunionstore = (...args)=>this.chain(new ZUnionStoreCommand(args, this.commandOptions));
        /**
   * @see https://redis.io/commands/zunion
   */ this.zunion = (...args)=>this.chain(new ZUnionCommand(args, this.commandOptions));
        this.client = opts.client;
        this.commands = [];
        this.commandOptions = opts.commandOptions;
        this.multiExec = opts.multiExec ?? false;
        if (this.commandOptions?.latencyLogging) {
            const originalExec = this.exec.bind(this);
            this.exec = async (options)=>{
                const start = performance.now();
                const result = await (options ? originalExec(options) : originalExec());
                const end = performance.now();
                const loggerResult = (end - start).toFixed(2);
                ;
                return result;
            };
        }
    }
    /**
   * Returns the length of pipeline before the execution
   */ length() {
        return this.commands.length;
    }
    /**
   * Pushes a command into the pipeline and returns a chainable instance of the
   * pipeline
   */ chain(command) {
        this.commands.push(command);
        return this;
    }
    /**
   * @see https://redis.io/commands/?group=json
   */ get json() {
        return {
            /**
       * @see https://redis.io/commands/json.arrappend
       */ arrappend: (...args)=>this.chain(new JsonArrAppendCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.arrindex
       */ arrindex: (...args)=>this.chain(new JsonArrIndexCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.arrinsert
       */ arrinsert: (...args)=>this.chain(new JsonArrInsertCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.arrlen
       */ arrlen: (...args)=>this.chain(new JsonArrLenCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.arrpop
       */ arrpop: (...args)=>this.chain(new JsonArrPopCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.arrtrim
       */ arrtrim: (...args)=>this.chain(new JsonArrTrimCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.clear
       */ clear: (...args)=>this.chain(new JsonClearCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.del
       */ del: (...args)=>this.chain(new JsonDelCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.forget
       */ forget: (...args)=>this.chain(new JsonForgetCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.get
       */ get: (...args)=>this.chain(new JsonGetCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.mget
       */ mget: (...args)=>this.chain(new JsonMGetCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.mset
       */ mset: (...args)=>this.chain(new JsonMSetCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.numincrby
       */ numincrby: (...args)=>this.chain(new JsonNumIncrByCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.nummultby
       */ nummultby: (...args)=>this.chain(new JsonNumMultByCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.objkeys
       */ objkeys: (...args)=>this.chain(new JsonObjKeysCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.objlen
       */ objlen: (...args)=>this.chain(new JsonObjLenCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.resp
       */ resp: (...args)=>this.chain(new JsonRespCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.set
       */ set: (...args)=>this.chain(new JsonSetCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.strappend
       */ strappend: (...args)=>this.chain(new JsonStrAppendCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.strlen
       */ strlen: (...args)=>this.chain(new JsonStrLenCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.toggle
       */ toggle: (...args)=>this.chain(new JsonToggleCommand(args, this.commandOptions)),
            /**
       * @see https://redis.io/commands/json.type
       */ type: (...args)=>this.chain(new JsonTypeCommand(args, this.commandOptions))
        };
    }
};
// pkg/auto-pipeline.ts
function createAutoPipelineProxy(_redis, json) {
    const redis = _redis;
    if (!redis.autoPipelineExecutor) {
        redis.autoPipelineExecutor = new AutoPipelineExecutor(redis);
    }
    return new Proxy(redis, {
        get: (redis2, command)=>{
            if (command === "pipelineCounter") {
                return redis2.autoPipelineExecutor.pipelineCounter;
            }
            if (command === "json") {
                return createAutoPipelineProxy(redis2, true);
            }
            const commandInRedisButNotPipeline = command in redis2 && !(command in redis2.autoPipelineExecutor.pipeline);
            if (commandInRedisButNotPipeline) {
                return redis2[command];
            }
            const isFunction = json ? typeof redis2.autoPipelineExecutor.pipeline.json[command] === "function" : typeof redis2.autoPipelineExecutor.pipeline[command] === "function";
            if (isFunction) {
                return (...args)=>{
                    return redis2.autoPipelineExecutor.withAutoPipeline((pipeline)=>{
                        if (json) {
                            pipeline.json[command](...args);
                        } else {
                            pipeline[command](...args);
                        }
                    });
                };
            }
            return redis2.autoPipelineExecutor.pipeline[command];
        }
    });
}
var AutoPipelineExecutor = class {
    // to keep track of how many times a pipeline was executed
    constructor(redis){
        this.pipelinePromises = /* @__PURE__ */ new WeakMap();
        this.activePipeline = null;
        this.indexInCurrentPipeline = 0;
        // only to make sure that proxy can work
        this.pipelineCounter = 0;
        this.redis = redis;
        this.pipeline = redis.pipeline();
    }
    async withAutoPipeline(executeWithPipeline) {
        const pipeline = this.activePipeline ?? this.redis.pipeline();
        if (!this.activePipeline) {
            this.activePipeline = pipeline;
            this.indexInCurrentPipeline = 0;
        }
        const index = this.indexInCurrentPipeline++;
        executeWithPipeline(pipeline);
        const pipelineDone = this.deferExecution().then(()=>{
            if (!this.pipelinePromises.has(pipeline)) {
                const pipelinePromise = pipeline.exec({
                    keepErrors: true
                });
                this.pipelineCounter += 1;
                this.pipelinePromises.set(pipeline, pipelinePromise);
                this.activePipeline = null;
            }
            return this.pipelinePromises.get(pipeline);
        });
        const results = await pipelineDone;
        const commandResult = results[index];
        if (commandResult.error) {
            throw new UpstashError(`Command failed: ${commandResult.error}`);
        }
        return commandResult.result;
    }
    async deferExecution() {
        await Promise.resolve();
        await Promise.resolve();
    }
};
// pkg/script.ts


var Script = class {
    constructor(redis, script){
        this.redis = redis;
        this.sha1 = this.digest(script);
        this.script = script;
    }
    /**
   * Send an `EVAL` command to redis.
   */ async eval(keys, args) {
        return await this.redis.eval(this.script, keys, args);
    }
    /**
   * Calculates the sha1 hash of the script and then calls `EVALSHA`.
   */ async evalsha(keys, args) {
        return await this.redis.evalsha(this.sha1, keys, args);
    }
    /**
   * Optimistically try to run `EVALSHA` first.
   * If the script is not loaded in redis, it will fall back and try again with `EVAL`.
   *
   * Following calls will be able to use the cached script
   */ async exec(keys, args) {
        const res = await this.redis.evalsha(this.sha1, keys, args).catch(async (error)=>{
            if (error instanceof Error && error.message.toLowerCase().includes("noscript")) {
                return await this.redis.eval(this.script, keys, args);
            }
            throw error;
        });
        return res;
    }
    /**
   * Compute the sha1 hash of the script and return its hex representation.
   */ digest(s) {
        return enc_hex.stringify(sha1(s));
    }
};
// pkg/redis.ts
var Redis = class {
    /**
   * Create a new redis client
   *
   * @example
   * ```typescript
   * const redis = new Redis({
   *  url: "<UPSTASH_REDIS_REST_URL>",
   *  token: "<UPSTASH_REDIS_REST_TOKEN>",
   * });
   * ```
   */ constructor(client, opts){
        /**
   * Wrap a new middleware around the HTTP client.
   */ this.use = (middleware)=>{
            const makeRequest = this.client.request.bind(this.client);
            this.client.request = (req)=>middleware(req, makeRequest);
        };
        /**
   * Technically this is not private, we can hide it from intellisense by doing this
   */ this.addTelemetry = (telemetry)=>{
            if (!this.enableTelemetry) {
                return;
            }
            try {
                this.client.mergeTelemetry(telemetry);
            } catch  {}
        };
        /**
   * Create a new pipeline that allows you to send requests in bulk.
   *
   * @see {@link Pipeline}
   */ this.pipeline = ()=>new Pipeline({
                client: this.client,
                commandOptions: this.opts,
                multiExec: false
            });
        this.autoPipeline = ()=>{
            return createAutoPipelineProxy(this);
        };
        /**
   * Create a new transaction to allow executing multiple steps atomically.
   *
   * All the commands in a transaction are serialized and executed sequentially. A request sent by
   * another client will never be served in the middle of the execution of a Redis Transaction. This
   * guarantees that the commands are executed as a single isolated operation.
   *
   * @see {@link Pipeline}
   */ this.multi = ()=>new Pipeline({
                client: this.client,
                commandOptions: this.opts,
                multiExec: true
            });
        /**
   * Returns an instance that can be used to execute `BITFIELD` commands on one key.
   *
   * @example
   * ```typescript
   * redis.set("mykey", 0);
   * const result = await redis.bitfield("mykey")
   *   .set("u4", 0, 16)
   *   .incr("u4", "#1", 1)
   *   .exec();
   * console.log(result); // [0, 1]
   * ```
   *
   * @see https://redis.io/commands/bitfield
   */ this.bitfield = (...args)=>new BitFieldCommand(args, this.client, this.opts);
        /**
   * @see https://redis.io/commands/append
   */ this.append = (...args)=>new AppendCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/bitcount
   */ this.bitcount = (...args)=>new BitCountCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/bitop
   */ this.bitop = (op, destinationKey, sourceKey, ...sourceKeys)=>new BitOpCommand([
                op,
                destinationKey,
                sourceKey,
                ...sourceKeys
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/bitpos
   */ this.bitpos = (...args)=>new BitPosCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/copy
   */ this.copy = (...args)=>new CopyCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/dbsize
   */ this.dbsize = ()=>new DBSizeCommand(this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/decr
   */ this.decr = (...args)=>new DecrCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/decrby
   */ this.decrby = (...args)=>new DecrByCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/del
   */ this.del = (...args)=>new DelCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/echo
   */ this.echo = (...args)=>new EchoCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/eval
   */ this.eval = (...args)=>new EvalCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/evalsha
   */ this.evalsha = (...args)=>new EvalshaCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/exists
   */ this.exists = (...args)=>new ExistsCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/expire
   */ this.expire = (...args)=>new ExpireCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/expireat
   */ this.expireat = (...args)=>new ExpireAtCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/flushall
   */ this.flushall = (args)=>new FlushAllCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/flushdb
   */ this.flushdb = (...args)=>new FlushDBCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/geoadd
   */ this.geoadd = (...args)=>new GeoAddCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/geopos
   */ this.geopos = (...args)=>new GeoPosCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/geodist
   */ this.geodist = (...args)=>new GeoDistCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/geohash
   */ this.geohash = (...args)=>new GeoHashCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/geosearch
   */ this.geosearch = (...args)=>new GeoSearchCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/geosearchstore
   */ this.geosearchstore = (...args)=>new GeoSearchStoreCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/get
   */ this.get = (...args)=>new GetCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/getbit
   */ this.getbit = (...args)=>new GetBitCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/getdel
   */ this.getdel = (...args)=>new GetDelCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/getrange
   */ this.getrange = (...args)=>new GetRangeCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/getset
   */ this.getset = (key, value)=>new GetSetCommand([
                key,
                value
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hdel
   */ this.hdel = (...args)=>new HDelCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hexists
   */ this.hexists = (...args)=>new HExistsCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hget
   */ this.hget = (...args)=>new HGetCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hgetall
   */ this.hgetall = (...args)=>new HGetAllCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hincrby
   */ this.hincrby = (...args)=>new HIncrByCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hincrbyfloat
   */ this.hincrbyfloat = (...args)=>new HIncrByFloatCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hkeys
   */ this.hkeys = (...args)=>new HKeysCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hlen
   */ this.hlen = (...args)=>new HLenCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hmget
   */ this.hmget = (...args)=>new HMGetCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hmset
   */ this.hmset = (key, kv)=>new HMSetCommand([
                key,
                kv
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hrandfield
   */ this.hrandfield = (key, count, withValues)=>new HRandFieldCommand([
                key,
                count,
                withValues
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hscan
   */ this.hscan = (...args)=>new HScanCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hset
   */ this.hset = (key, kv)=>new HSetCommand([
                key,
                kv
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hsetnx
   */ this.hsetnx = (key, field, value)=>new HSetNXCommand([
                key,
                field,
                value
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hstrlen
   */ this.hstrlen = (...args)=>new HStrLenCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/hvals
   */ this.hvals = (...args)=>new HValsCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/incr
   */ this.incr = (...args)=>new IncrCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/incrby
   */ this.incrby = (...args)=>new IncrByCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/incrbyfloat
   */ this.incrbyfloat = (...args)=>new IncrByFloatCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/keys
   */ this.keys = (...args)=>new KeysCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/lindex
   */ this.lindex = (...args)=>new LIndexCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/linsert
   */ this.linsert = (key, direction, pivot, value)=>new LInsertCommand([
                key,
                direction,
                pivot,
                value
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/llen
   */ this.llen = (...args)=>new LLenCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/lmove
   */ this.lmove = (...args)=>new LMoveCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/lpop
   */ this.lpop = (...args)=>new LPopCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/lmpop
   */ this.lmpop = (...args)=>new LmPopCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/lpos
   */ this.lpos = (...args)=>new LPosCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/lpush
   */ this.lpush = (key, ...elements)=>new LPushCommand([
                key,
                ...elements
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/lpushx
   */ this.lpushx = (key, ...elements)=>new LPushXCommand([
                key,
                ...elements
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/lrange
   */ this.lrange = (...args)=>new LRangeCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/lrem
   */ this.lrem = (key, count, value)=>new LRemCommand([
                key,
                count,
                value
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/lset
   */ this.lset = (key, index, value)=>new LSetCommand([
                key,
                index,
                value
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/ltrim
   */ this.ltrim = (...args)=>new LTrimCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/mget
   */ this.mget = (...args)=>new MGetCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/mset
   */ this.mset = (kv)=>new MSetCommand([
                kv
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/msetnx
   */ this.msetnx = (kv)=>new MSetNXCommand([
                kv
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/persist
   */ this.persist = (...args)=>new PersistCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/pexpire
   */ this.pexpire = (...args)=>new PExpireCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/pexpireat
   */ this.pexpireat = (...args)=>new PExpireAtCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/pfadd
   */ this.pfadd = (...args)=>new PfAddCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/pfcount
   */ this.pfcount = (...args)=>new PfCountCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/pfmerge
   */ this.pfmerge = (...args)=>new PfMergeCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/ping
   */ this.ping = (args)=>new PingCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/psetex
   */ this.psetex = (key, ttl, value)=>new PSetEXCommand([
                key,
                ttl,
                value
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/pttl
   */ this.pttl = (...args)=>new PTtlCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/publish
   */ this.publish = (...args)=>new PublishCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/randomkey
   */ this.randomkey = ()=>new RandomKeyCommand().exec(this.client);
        /**
   * @see https://redis.io/commands/rename
   */ this.rename = (...args)=>new RenameCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/renamenx
   */ this.renamenx = (...args)=>new RenameNXCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/rpop
   */ this.rpop = (...args)=>new RPopCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/rpush
   */ this.rpush = (key, ...elements)=>new RPushCommand([
                key,
                ...elements
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/rpushx
   */ this.rpushx = (key, ...elements)=>new RPushXCommand([
                key,
                ...elements
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/sadd
   */ this.sadd = (key, member, ...members)=>new SAddCommand([
                key,
                member,
                ...members
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/scan
   */ this.scan = (...args)=>new ScanCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/scard
   */ this.scard = (...args)=>new SCardCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/script-exists
   */ this.scriptExists = (...args)=>new ScriptExistsCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/script-flush
   */ this.scriptFlush = (...args)=>new ScriptFlushCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/script-load
   */ this.scriptLoad = (...args)=>new ScriptLoadCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/sdiff
   */ this.sdiff = (...args)=>new SDiffCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/sdiffstore
   */ this.sdiffstore = (...args)=>new SDiffStoreCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/set
   */ this.set = (key, value, opts)=>new SetCommand([
                key,
                value,
                opts
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/setbit
   */ this.setbit = (...args)=>new SetBitCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/setex
   */ this.setex = (key, ttl, value)=>new SetExCommand([
                key,
                ttl,
                value
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/setnx
   */ this.setnx = (key, value)=>new SetNxCommand([
                key,
                value
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/setrange
   */ this.setrange = (...args)=>new SetRangeCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/sinter
   */ this.sinter = (...args)=>new SInterCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/sinterstore
   */ this.sinterstore = (...args)=>new SInterStoreCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/sismember
   */ this.sismember = (key, member)=>new SIsMemberCommand([
                key,
                member
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/smismember
   */ this.smismember = (key, members)=>new SMIsMemberCommand([
                key,
                members
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/smembers
   */ this.smembers = (...args)=>new SMembersCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/smove
   */ this.smove = (source, destination, member)=>new SMoveCommand([
                source,
                destination,
                member
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/spop
   */ this.spop = (...args)=>new SPopCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/srandmember
   */ this.srandmember = (...args)=>new SRandMemberCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/srem
   */ this.srem = (key, ...members)=>new SRemCommand([
                key,
                ...members
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/sscan
   */ this.sscan = (...args)=>new SScanCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/strlen
   */ this.strlen = (...args)=>new StrLenCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/sunion
   */ this.sunion = (...args)=>new SUnionCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/sunionstore
   */ this.sunionstore = (...args)=>new SUnionStoreCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/time
   */ this.time = ()=>new TimeCommand().exec(this.client);
        /**
   * @see https://redis.io/commands/touch
   */ this.touch = (...args)=>new TouchCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/ttl
   */ this.ttl = (...args)=>new TtlCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/type
   */ this.type = (...args)=>new TypeCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/unlink
   */ this.unlink = (...args)=>new UnlinkCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xadd
   */ this.xadd = (...args)=>new XAddCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xack
   */ this.xack = (...args)=>new XAckCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xdel
   */ this.xdel = (...args)=>new XDelCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xgroup
   */ this.xgroup = (...args)=>new XGroupCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xread
   */ this.xread = (...args)=>new XReadCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xreadgroup
   */ this.xreadgroup = (...args)=>new XReadGroupCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xinfo
   */ this.xinfo = (...args)=>new XInfoCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xlen
   */ this.xlen = (...args)=>new XLenCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xpending
   */ this.xpending = (...args)=>new XPendingCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xclaim
   */ this.xclaim = (...args)=>new XClaimCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xautoclaim
   */ this.xautoclaim = (...args)=>new XAutoClaim(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xtrim
   */ this.xtrim = (...args)=>new XTrimCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xrange
   */ this.xrange = (...args)=>new XRangeCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/xrevrange
   */ this.xrevrange = (...args)=>new XRevRangeCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zadd
   */ this.zadd = (...args)=>{
            if ("score" in args[1]) {
                return new ZAddCommand([
                    args[0],
                    args[1],
                    ...args.slice(2)
                ], this.opts).exec(this.client);
            }
            return new ZAddCommand([
                args[0],
                args[1],
                ...args.slice(2)
            ], this.opts).exec(this.client);
        };
        /**
   * @see https://redis.io/commands/zcard
   */ this.zcard = (...args)=>new ZCardCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zcount
   */ this.zcount = (...args)=>new ZCountCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zdiffstore
   */ this.zdiffstore = (...args)=>new ZDiffStoreCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zincrby
   */ this.zincrby = (key, increment, member)=>new ZIncrByCommand([
                key,
                increment,
                member
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zinterstore
   */ this.zinterstore = (...args)=>new ZInterStoreCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zlexcount
   */ this.zlexcount = (...args)=>new ZLexCountCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zmscore
   */ this.zmscore = (...args)=>new ZMScoreCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zpopmax
   */ this.zpopmax = (...args)=>new ZPopMaxCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zpopmin
   */ this.zpopmin = (...args)=>new ZPopMinCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zrange
   */ this.zrange = (...args)=>new ZRangeCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zrank
   */ this.zrank = (key, member)=>new ZRankCommand([
                key,
                member
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zrem
   */ this.zrem = (key, ...members)=>new ZRemCommand([
                key,
                ...members
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zremrangebylex
   */ this.zremrangebylex = (...args)=>new ZRemRangeByLexCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zremrangebyrank
   */ this.zremrangebyrank = (...args)=>new ZRemRangeByRankCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zremrangebyscore
   */ this.zremrangebyscore = (...args)=>new ZRemRangeByScoreCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zrevrank
   */ this.zrevrank = (key, member)=>new ZRevRankCommand([
                key,
                member
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zscan
   */ this.zscan = (...args)=>new ZScanCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zscore
   */ this.zscore = (key, member)=>new ZScoreCommand([
                key,
                member
            ], this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zunion
   */ this.zunion = (...args)=>new ZUnionCommand(args, this.opts).exec(this.client);
        /**
   * @see https://redis.io/commands/zunionstore
   */ this.zunionstore = (...args)=>new ZUnionStoreCommand(args, this.opts).exec(this.client);
        this.client = client;
        this.opts = opts;
        this.enableTelemetry = opts?.enableTelemetry ?? true;
        if (opts?.readYourWrites === false) {
            this.client.readYourWrites = false;
        }
        this.enableAutoPipelining = opts?.enableAutoPipelining ?? true;
    }
    get readYourWritesSyncToken() {
        return this.client.upstashSyncToken;
    }
    set readYourWritesSyncToken(session) {
        this.client.upstashSyncToken = session;
    }
    get json() {
        return {
            /**
       * @see https://redis.io/commands/json.arrappend
       */ arrappend: (...args)=>new JsonArrAppendCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.arrindex
       */ arrindex: (...args)=>new JsonArrIndexCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.arrinsert
       */ arrinsert: (...args)=>new JsonArrInsertCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.arrlen
       */ arrlen: (...args)=>new JsonArrLenCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.arrpop
       */ arrpop: (...args)=>new JsonArrPopCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.arrtrim
       */ arrtrim: (...args)=>new JsonArrTrimCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.clear
       */ clear: (...args)=>new JsonClearCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.del
       */ del: (...args)=>new JsonDelCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.forget
       */ forget: (...args)=>new JsonForgetCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.get
       */ get: (...args)=>new JsonGetCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.mget
       */ mget: (...args)=>new JsonMGetCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.mset
       */ mset: (...args)=>new JsonMSetCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.numincrby
       */ numincrby: (...args)=>new JsonNumIncrByCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.nummultby
       */ nummultby: (...args)=>new JsonNumMultByCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.objkeys
       */ objkeys: (...args)=>new JsonObjKeysCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.objlen
       */ objlen: (...args)=>new JsonObjLenCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.resp
       */ resp: (...args)=>new JsonRespCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.set
       */ set: (...args)=>new JsonSetCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.strappend
       */ strappend: (...args)=>new JsonStrAppendCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.strlen
       */ strlen: (...args)=>new JsonStrLenCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.toggle
       */ toggle: (...args)=>new JsonToggleCommand(args, this.opts).exec(this.client),
            /**
       * @see https://redis.io/commands/json.type
       */ type: (...args)=>new JsonTypeCommand(args, this.opts).exec(this.client)
        };
    }
    createScript(script) {
        return new Script(this, script);
    }
};
// version.ts
var VERSION = "v1.34.3";


;// CONCATENATED MODULE: ./node_modules/@upstash/redis/nodejs.mjs
/* provided dependency */ var Buffer = __webpack_require__(195)["Buffer"];

// platforms/nodejs.ts
if (typeof atob === "undefined") {
    global.atob = (b64)=>Buffer.from(b64, "base64").toString("utf8");
}
var Redis2 = class _Redis extends Redis {
    /**
   * Create a new redis client by providing a custom `Requester` implementation
   *
   * @example
   * ```ts
   *
   * import { UpstashRequest, Requester, UpstashResponse, Redis } from "@upstash/redis"
   *
   *  const requester: Requester = {
   *    request: <TResult>(req: UpstashRequest): Promise<UpstashResponse<TResult>> => {
   *      // ...
   *    }
   *  }
   *
   * const redis = new Redis(requester)
   * ```
   */ constructor(configOrRequester){
        if ("request" in configOrRequester) {
            super(configOrRequester);
            return;
        }
        if (!configOrRequester.url) {
            ;
        } else if (configOrRequester.url.startsWith(" ") || configOrRequester.url.endsWith(" ") || /\r|\n/.test(configOrRequester.url)) {
            ;
        }
        if (!configOrRequester.token) {
            ;
        } else if (configOrRequester.token.startsWith(" ") || configOrRequester.token.endsWith(" ") || /\r|\n/.test(configOrRequester.token)) {
            ;
        }
        const client = new HttpClient({
            baseUrl: configOrRequester.url,
            retry: configOrRequester.retry,
            headers: {
                authorization: `Bearer ${configOrRequester.token}`
            },
            agent: configOrRequester.agent,
            responseEncoding: configOrRequester.responseEncoding,
            cache: configOrRequester.cache ?? "no-store",
            signal: configOrRequester.signal,
            keepAlive: configOrRequester.keepAlive,
            readYourWrites: configOrRequester.readYourWrites
        });
        super(client, {
            automaticDeserialization: configOrRequester.automaticDeserialization,
            enableTelemetry: !process.env.UPSTASH_DISABLE_TELEMETRY,
            latencyLogging: configOrRequester.latencyLogging,
            enableAutoPipelining: configOrRequester.enableAutoPipelining
        });
        this.addTelemetry({
            runtime: // @ts-expect-error to silence compiler
             true ? "edge-light" : 0,
            platform: process.env.VERCEL ? "vercel" : process.env.AWS_REGION ? "aws" : "unknown",
            sdk: `@upstash/redis@${VERSION}`
        });
        if (this.enableAutoPipelining) {
            return this.autoPipeline();
        }
    }
    /**
   * Create a new Upstash Redis instance from environment variables.
   *
   * Use this to automatically load connection secrets from your environment
   * variables. For instance when using the Vercel integration.
   *
   * This tries to load `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from
   * your environment using `process.env`.
   */ static fromEnv(config) {
        if (process.env === void 0) {
            throw new TypeError('[Upstash Redis] Unable to get environment variables, `process.env` is undefined. If you are deploying to cloudflare, please import from "@upstash/redis/cloudflare" instead');
        }
        const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
        if (!url) {
            ;
        }
        const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
        if (!token) {
            ;
        }
        return new _Redis({
            ...config,
            url,
            token
        });
    }
};


;// CONCATENATED MODULE: ./src/middleware.ts



// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new dist.Ratelimit({
    redis: Redis2.fromEnv(),
    limiter: dist.Ratelimit.slidingWindow(10, "10 s"),
    analytics: true
});
// Paths that require authentication
const protectedPaths = [
    "/dashboard"
];
// Paths that are only accessible to non-authenticated users
const authPaths = [
    "/login",
    "/register",
    "/reset-password"
];
// Paths that are public
const publicPaths = [
    "/",
    "/about",
    "/projects",
    "/contact"
];
// Security headers following OWASP recommendations
const securityHeaders = {
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https:;",
    "X-DNS-Prefetch-Control": "on",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()"
};
async function middleware(request) {
    const response = NextResponse.next();
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("auth-token")?.value;
    // Apply security headers
    Object.entries(securityHeaders).forEach(([key, value])=>{
        response.headers.set(key, value);
    });
    // Apply rate limiting for auth routes
    if (authPaths.some((path)=>pathname === path)) {
        const ip = request.ip ?? "127.0.0.1";
        const { success } = await ratelimit.limit(`ratelimit_${ip}`);
        if (!success) {
            return new NextResponse("Too Many Requests", {
                status: 429,
                headers: {
                    "Retry-After": "10"
                }
            });
        }
    }
    // Check if the path is protected
    const isProtectedPath = protectedPaths.some((path)=>pathname.startsWith(path));
    // Check if the path is an auth path
    const isAuthPath = authPaths.some((path)=>pathname === path);
    // Check if the path is public
    const isPublicPath = publicPaths.some((path)=>pathname === path);
    // If the path is protected and there's no token, redirect to login
    if (isProtectedPath && !token) {
        const url = new URL("/login", request.url);
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
    }
    // If the path is an auth path and there's a token, redirect to dashboard
    if (isAuthPath && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Add CSRF protection
    if (request.method !== "GET" && request.method !== "HEAD") {
        const csrfToken = request.headers.get("X-CSRF-Token");
        const expectedToken = request.cookies.get("csrf-token")?.value;
        if (!csrfToken || csrfToken !== expectedToken) {
            return new NextResponse("Invalid CSRF token", {
                status: 403
            });
        }
    }
    return response;
}
const config = {
    // Matcher ignoring _next/static, _next/image, favicon.ico, api routes
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
};

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=private-next-root-dir%2Fsrc%2Fmiddleware.ts&page=%2Fsrc%2Fmiddleware&rootDir=%2FUsers%2Fuser%2FDesktop%2FCoding%20%3C%3A%3E%2FWebDev%2FProjects%2FPortfolio-OOP-project-7%2Fclient&matchers=W3sicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpPyg%2FOlxcLygoPyFhcGl8X25leHRcXC9zdGF0aWN8X25leHRcXC9pbWFnZXxmYXZpY29uLmljbykuKikpKC5qc29uKT9bXFwvI1xcP10%2FJCIsIm9yaWdpbmFsU291cmNlIjoiLygoPyFhcGl8X25leHQvc3RhdGljfF9uZXh0L2ltYWdlfGZhdmljb24uaWNvKS4qKSJ9XQ%3D%3D&preferredRegion=&middlewareConfig=eyJtYXRjaGVycyI6W3sicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpPyg%2FOlxcLygoPyFhcGl8X25leHRcXC9zdGF0aWN8X25leHRcXC9pbWFnZXxmYXZpY29uLmljbykuKikpKC5qc29uKT9bXFwvI1xcP10%2FJCIsIm9yaWdpbmFsU291cmNlIjoiLygoPyFhcGl8X25leHQvc3RhdGljfF9uZXh0L2ltYWdlfGZhdmljb24uaWNvKS4qKSJ9XX0%3D!


// Import the userland code.

const mod = {
    ...middleware_namespaceObject
};
const handler = mod.middleware || mod.default;
const page = "/src/middleware";
if (typeof handler !== "function") {
    throw new Error(`The Middleware "${page}" must export a \`middleware\` or a \`default\` function`);
}
function nHandler(opts) {
    return adapter({
        ...opts,
        page,
        handler
    });
}

//# sourceMappingURL=middleware.js.map

/***/ }),

/***/ 657:
/***/ ((module) => {

"use strict";

var g = Object.defineProperty;
var k = Object.getOwnPropertyDescriptor;
var _ = Object.getOwnPropertyNames;
var w = Object.prototype.hasOwnProperty;
var y = (l, e)=>{
    for(var t in e)g(l, t, {
        get: e[t],
        enumerable: !0
    });
}, A = (l, e, t, n)=>{
    if (e && typeof e == "object" || typeof e == "function") for (let s of _(e))!w.call(l, s) && s !== t && g(l, s, {
        get: ()=>e[s],
        enumerable: !(n = k(e, s)) || n.enumerable
    });
    return l;
};
var S = (l)=>A(g({}, "__esModule", {
        value: !0
    }), l);
var x = {};
y(x, {
    Analytics: ()=>b
});
module.exports = S(x);
var p = `
local key = KEYS[1]
local field = ARGV[1]

local data = redis.call("ZRANGE", key, 0, -1, "WITHSCORES")
local count = {}

for i = 1, #data, 2 do
  local json_str = data[i]
  local score = tonumber(data[i + 1])
  local obj = cjson.decode(json_str)

  local fieldValue = obj[field]

  if count[fieldValue] == nil then
    count[fieldValue] = score
  else
    count[fieldValue] = count[fieldValue] + score
  end
end

local result = {}
for k, v in pairs(count) do
  table.insert(result, {k, v})
end

return result
`, f = `
local prefix = KEYS[1]
local first_timestamp = tonumber(ARGV[1])
local increment = tonumber(ARGV[2])
local num_timestamps = tonumber(ARGV[3])
local num_elements = tonumber(ARGV[4])

local keys = {}
for i = 1, num_timestamps do
  local timestamp = first_timestamp - (i - 1) * increment
  table.insert(keys, prefix .. ":" .. timestamp)
end

-- get the union of the groups
local zunion_params = {"ZUNION", num_timestamps, unpack(keys)}
table.insert(zunion_params, "WITHSCORES")
local result = redis.call(unpack(zunion_params))

-- select num_elements many items
local true_group = {}
local false_group = {}
local denied_group = {}
local true_count = 0
local false_count = 0
local denied_count = 0
local i = #result - 1

-- iterate over the results
while (true_count + false_count + denied_count) < (num_elements * 3) and 1 <= i do
  local score = tonumber(result[i + 1])
  if score > 0 then
    local element = result[i]
    if string.find(element, "success\\":true") and true_count < num_elements then
      table.insert(true_group, {score, element})
      true_count = true_count + 1
    elseif string.find(element, "success\\":false") and false_count < num_elements then
      table.insert(false_group, {score, element})
      false_count = false_count + 1
    elseif string.find(element, "success\\":\\"denied") and denied_count < num_elements then
      table.insert(denied_group, {score, element})
      denied_count = denied_count + 1
    end
  end
  i = i - 2
end

return {true_group, false_group, denied_group}
`, h = `
local prefix = KEYS[1]
local first_timestamp = tonumber(ARGV[1])
local increment = tonumber(ARGV[2])
local num_timestamps = tonumber(ARGV[3])

local keys = {}
for i = 1, num_timestamps do
  local timestamp = first_timestamp - (i - 1) * increment
  table.insert(keys, prefix .. ":" .. timestamp)
end

-- get the union of the groups
local zunion_params = {"ZUNION", num_timestamps, unpack(keys)}
table.insert(zunion_params, "WITHSCORES")
local result = redis.call(unpack(zunion_params))

return result
`;
var b = class {
    constructor(e){
        this.redis = e.redis, this.prefix = e.prefix ?? "@upstash/analytics", this.bucketSize = this.parseWindow(e.window);
    }
    validateTableName(e) {
        if (!/^[a-zA-Z0-9_-]+$/.test(e)) throw new Error(`Invalid table name: ${e}. Table names can only contain letters, numbers, dashes and underscores.`);
    }
    parseWindow(e) {
        if (typeof e == "number") {
            if (e <= 0) throw new Error(`Invalid window: ${e}`);
            return e;
        }
        let t = /^(\d+)([smhd])$/;
        if (!t.test(e)) throw new Error(`Invalid window: ${e}`);
        let [, n, s] = e.match(t), i = parseInt(n);
        switch(s){
            case "s":
                return i * 1e3;
            case "m":
                return i * 1e3 * 60;
            case "h":
                return i * 1e3 * 60 * 60;
            case "d":
                return i * 1e3 * 60 * 60 * 24;
            default:
                throw new Error(`Invalid window unit: ${s}`);
        }
    }
    getBucket(e) {
        let t = e ?? Date.now();
        return Math.floor(t / this.bucketSize) * this.bucketSize;
    }
    async ingest(e, ...t) {
        this.validateTableName(e), await Promise.all(t.map(async (n)=>{
            let s = this.getBucket(n.time), i = [
                this.prefix,
                e,
                s
            ].join(":");
            await this.redis.zincrby(i, 1, JSON.stringify({
                ...n,
                time: void 0
            }));
        }));
    }
    formatBucketAggregate(e, t, n) {
        let s = {};
        return e.forEach(([i, r])=>{
            t == "success" && (i = i === 1 ? "true" : i === null ? "false" : i), s[t] = s[t] || {}, s[t][(i ?? "null").toString()] = r;
        }), {
            time: n,
            ...s
        };
    }
    async aggregateBucket(e, t, n) {
        this.validateTableName(e);
        let s = this.getBucket(n), i = [
            this.prefix,
            e,
            s
        ].join(":"), r = await this.redis.eval(p, [
            i
        ], [
            t
        ]);
        return this.formatBucketAggregate(r, t, s);
    }
    async aggregateBuckets(e, t, n, s) {
        this.validateTableName(e);
        let i = this.getBucket(s), r = [];
        for(let o = 0; o < n; o += 1)r.push(this.aggregateBucket(e, t, i)), i = i - this.bucketSize;
        return Promise.all(r);
    }
    async aggregateBucketsWithPipeline(e, t, n, s, i) {
        this.validateTableName(e), i = i ?? 48;
        let r = this.getBucket(s), o = [], c = this.redis.pipeline(), u = [];
        for(let a = 1; a <= n; a += 1){
            let d = [
                this.prefix,
                e,
                r
            ].join(":");
            c.eval(p, [
                d
            ], [
                t
            ]), o.push(r), r = r - this.bucketSize, (a % i == 0 || a == n) && (u.push(c.exec()), c = this.redis.pipeline());
        }
        return (await Promise.all(u)).flat().map((a, d)=>this.formatBucketAggregate(a, t, o[d]));
    }
    async getAllowedBlocked(e, t, n) {
        this.validateTableName(e);
        let s = [
            this.prefix,
            e
        ].join(":"), i = this.getBucket(n), r = await this.redis.eval(h, [
            s
        ], [
            i,
            this.bucketSize,
            t
        ]), o = {};
        for(let c = 0; c < r.length; c += 2){
            let u = r[c], m = u.identifier, a = +r[c + 1];
            o[m] || (o[m] = {
                success: 0,
                blocked: 0
            }), o[m][u.success ? "success" : "blocked"] = a;
        }
        return o;
    }
    async getMostAllowedBlocked(e, t, n, s) {
        this.validateTableName(e);
        let i = [
            this.prefix,
            e
        ].join(":"), r = this.getBucket(s), [o, c, u] = await this.redis.eval(f, [
            i
        ], [
            r,
            this.bucketSize,
            t,
            n
        ]);
        return {
            allowed: this.toDicts(o),
            ratelimited: this.toDicts(c),
            denied: this.toDicts(u)
        };
    }
    toDicts(e) {
        let t = [];
        for(let n = 0; n < e.length; n += 1){
            let s = +e[n][0], i = e[n][1];
            t.push({
                identifier: i.identifier,
                count: s
            });
        }
        return t;
    }
};
0 && (0);


/***/ }),

/***/ 466:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// src/index.ts
var src_exports = {};
__export(src_exports, {
    Analytics: ()=>Analytics,
    IpDenyList: ()=>ip_deny_list_exports,
    MultiRegionRatelimit: ()=>MultiRegionRatelimit,
    Ratelimit: ()=>RegionRatelimit
});
module.exports = __toCommonJS(src_exports);
// src/analytics.ts
var import_core_analytics = __webpack_require__(657);
var Analytics = class {
    constructor(config){
        this.table = "events";
        this.analytics = new import_core_analytics.Analytics({
            // @ts-expect-error we need to fix the types in core-analytics, it should only require the methods it needs, not the whole sdk
            redis: config.redis,
            window: "1h",
            prefix: config.prefix ?? "@upstash/ratelimit",
            retention: "90d"
        });
    }
    /**
   * Try to extract the geo information from the request
   *
   * This handles Vercel's `req.geo` and  and Cloudflare's `request.cf` properties
   * @param req
   * @returns
   */ extractGeo(req) {
        if (typeof req.geo !== "undefined") {
            return req.geo;
        }
        if (typeof req.cf !== "undefined") {
            return req.cf;
        }
        return {};
    }
    async record(event) {
        await this.analytics.ingest(this.table, event);
    }
    async series(filter, cutoff) {
        const timestampCount = Math.min((this.analytics.getBucket(Date.now()) - this.analytics.getBucket(cutoff)) / (60 * 60 * 1e3), 256);
        return this.analytics.aggregateBucketsWithPipeline(this.table, filter, timestampCount);
    }
    async getUsage(cutoff = 0) {
        const timestampCount = Math.min((this.analytics.getBucket(Date.now()) - this.analytics.getBucket(cutoff)) / (60 * 60 * 1e3), 256);
        const records = await this.analytics.getAllowedBlocked(this.table, timestampCount);
        return records;
    }
    async getUsageOverTime(timestampCount, groupby) {
        const result = await this.analytics.aggregateBucketsWithPipeline(this.table, groupby, timestampCount);
        return result;
    }
    async getMostAllowedBlocked(timestampCount, getTop) {
        getTop = getTop ?? 5;
        return this.analytics.getMostAllowedBlocked(this.table, timestampCount, getTop);
    }
};
// src/cache.ts
var Cache = class {
    constructor(cache){
        this.cache = cache;
    }
    isBlocked(identifier) {
        if (!this.cache.has(identifier)) {
            return {
                blocked: false,
                reset: 0
            };
        }
        const reset = this.cache.get(identifier);
        if (reset < Date.now()) {
            this.cache.delete(identifier);
            return {
                blocked: false,
                reset: 0
            };
        }
        return {
            blocked: true,
            reset
        };
    }
    blockUntil(identifier, reset) {
        this.cache.set(identifier, reset);
    }
    set(key, value) {
        this.cache.set(key, value);
    }
    get(key) {
        return this.cache.get(key) || null;
    }
    incr(key) {
        let value = this.cache.get(key) ?? 0;
        value += 1;
        this.cache.set(key, value);
        return value;
    }
    pop(key) {
        this.cache.delete(key);
    }
    empty() {
        this.cache.clear();
    }
    size() {
        return this.cache.size;
    }
};
// src/duration.ts
function ms(d) {
    const match = d.match(/^(\d+)\s?(ms|s|m|h|d)$/);
    if (!match) {
        throw new Error(`Unable to parse window size: ${d}`);
    }
    const time = Number.parseInt(match[1]);
    const unit = match[2];
    switch(unit){
        case "ms":
            return time;
        case "s":
            return time * 1e3;
        case "m":
            return time * 1e3 * 60;
        case "h":
            return time * 1e3 * 60 * 60;
        case "d":
            return time * 1e3 * 60 * 60 * 24;
        default:
            throw new Error(`Unable to parse window size: ${d}`);
    }
}
// src/hash.ts
var setHash = async (ctx, script, kind)=>{
    const regionContexts = "redis" in ctx ? [
        ctx
    ] : ctx.regionContexts;
    const hashSample = regionContexts[0].scriptHashes[kind];
    if (!hashSample) {
        await Promise.all(regionContexts.map(async (context)=>{
            context.scriptHashes[kind] = await context.redis.scriptLoad(script);
        }));
    }
    ;
};
var safeEval = async (ctx, script, kind, keys, args)=>{
    if (!ctx.cacheScripts) {
        return await ctx.redis.eval(script, keys, args);
    }
    ;
    await setHash(ctx, script, kind);
    try {
        return await ctx.redis.evalsha(ctx.scriptHashes[kind], keys, args);
    } catch (error) {
        if (`${error}`.includes("NOSCRIPT")) {
            ;
            ctx.scriptHashes[kind] = void 0;
            await setHash(ctx, script, kind);
            ;
            return await ctx.redis.evalsha(ctx.scriptHashes[kind], keys, args);
        }
        throw error;
    }
};
// src/lua-scripts/multi.ts
var fixedWindowLimitScript = `
	local key           = KEYS[1]
	local id            = ARGV[1]
	local window        = ARGV[2]
	local incrementBy   = tonumber(ARGV[3])

	redis.call("HSET", key, id, incrementBy)
	local fields = redis.call("HGETALL", key)
	if #fields == 2 and tonumber(fields[2])==incrementBy then
	-- The first time this key is set, and the value will be equal to incrementBy.
	-- So we only need the expire command once
	  redis.call("PEXPIRE", key, window)
	end

	return fields
`;
var fixedWindowRemainingTokensScript = `
      local key = KEYS[1]
      local tokens = 0

      local fields = redis.call("HGETALL", key)

      return fields
    `;
var slidingWindowLimitScript = `
	local currentKey    = KEYS[1]           -- identifier including prefixes
	local previousKey   = KEYS[2]           -- key of the previous bucket
	local tokens        = tonumber(ARGV[1]) -- tokens per window
	local now           = ARGV[2]           -- current timestamp in milliseconds
	local window        = ARGV[3]           -- interval in milliseconds
	local requestId     = ARGV[4]           -- uuid for this request
	local incrementBy   = tonumber(ARGV[5]) -- custom rate, default is  1

	local currentFields = redis.call("HGETALL", currentKey)
	local requestsInCurrentWindow = 0
	for i = 2, #currentFields, 2 do
	requestsInCurrentWindow = requestsInCurrentWindow + tonumber(currentFields[i])
	end

	local previousFields = redis.call("HGETALL", previousKey)
	local requestsInPreviousWindow = 0
	for i = 2, #previousFields, 2 do
	requestsInPreviousWindow = requestsInPreviousWindow + tonumber(previousFields[i])
	end

	local percentageInCurrent = ( now % window) / window
	if requestsInPreviousWindow * (1 - percentageInCurrent ) + requestsInCurrentWindow >= tokens then
	  return {currentFields, previousFields, false}
	end

	redis.call("HSET", currentKey, requestId, incrementBy)

	if requestsInCurrentWindow == 0 then 
	  -- The first time this key is set, the value will be equal to incrementBy.
	  -- So we only need the expire command once
	  redis.call("PEXPIRE", currentKey, window * 2 + 1000) -- Enough time to overlap with a new window + 1 second
	end
	return {currentFields, previousFields, true}
`;
var slidingWindowRemainingTokensScript = `
	local currentKey    = KEYS[1]           -- identifier including prefixes
	local previousKey   = KEYS[2]           -- key of the previous bucket
	local now         	= ARGV[1]           -- current timestamp in milliseconds
  	local window      	= ARGV[2]           -- interval in milliseconds

	local currentFields = redis.call("HGETALL", currentKey)
	local requestsInCurrentWindow = 0
	for i = 2, #currentFields, 2 do
	requestsInCurrentWindow = requestsInCurrentWindow + tonumber(currentFields[i])
	end

	local previousFields = redis.call("HGETALL", previousKey)
	local requestsInPreviousWindow = 0
	for i = 2, #previousFields, 2 do
	requestsInPreviousWindow = requestsInPreviousWindow + tonumber(previousFields[i])
	end

	local percentageInCurrent = ( now % window) / window
  	requestsInPreviousWindow = math.floor(( 1 - percentageInCurrent ) * requestsInPreviousWindow)
	
	return requestsInCurrentWindow + requestsInPreviousWindow
`;
// src/lua-scripts/reset.ts
var resetScript = `
      local pattern = KEYS[1]

      -- Initialize cursor to start from 0
      local cursor = "0"

      repeat
          -- Scan for keys matching the pattern
          local scan_result = redis.call('SCAN', cursor, 'MATCH', pattern)

          -- Extract cursor for the next iteration
          cursor = scan_result[1]

          -- Extract keys from the scan result
          local keys = scan_result[2]

          for i=1, #keys do
          redis.call('DEL', keys[i])
          end

      -- Continue scanning until cursor is 0 (end of keyspace)
      until cursor == "0"
    `;
// src/types.ts
var DenyListExtension = "denyList";
var IpDenyListKey = "ipDenyList";
var IpDenyListStatusKey = "ipDenyListStatus";
// src/deny-list/scripts.ts
var checkDenyListScript = `
  -- Checks if values provideed in ARGV are present in the deny lists.
  -- This is done using the allDenyListsKey below.

  -- Additionally, checks the status of the ip deny list using the
  -- ipDenyListStatusKey below. Here are the possible states of the
  -- ipDenyListStatusKey key:
  -- * status == -1: set to "disabled" with no TTL
  -- * status == -2: not set, meaning that is was set before but expired
  -- * status  >  0: set to "valid", with a TTL
  --
  -- In the case of status == -2, we set the status to "pending" with
  -- 30 second ttl. During this time, the process which got status == -2
  -- will update the ip deny list.

  local allDenyListsKey     = KEYS[1]
  local ipDenyListStatusKey = KEYS[2]

  local results = redis.call('SMISMEMBER', allDenyListsKey, unpack(ARGV))
  local status  = redis.call('TTL', ipDenyListStatusKey)
  if status == -2 then
    redis.call('SETEX', ipDenyListStatusKey, 30, "pending")
  end

  return { results, status }
`;
// src/deny-list/ip-deny-list.ts
var ip_deny_list_exports = {};
__export(ip_deny_list_exports, {
    ThresholdError: ()=>ThresholdError,
    disableIpDenyList: ()=>disableIpDenyList,
    updateIpDenyList: ()=>updateIpDenyList
});
// src/deny-list/time.ts
var MILLISECONDS_IN_HOUR = 60 * 60 * 1e3;
var MILLISECONDS_IN_DAY = 24 * MILLISECONDS_IN_HOUR;
var MILLISECONDS_TO_2AM = 2 * MILLISECONDS_IN_HOUR;
var getIpListTTL = (time)=>{
    const now = time || Date.now();
    const timeSinceLast2AM = (now - MILLISECONDS_TO_2AM) % MILLISECONDS_IN_DAY;
    return MILLISECONDS_IN_DAY - timeSinceLast2AM;
};
// src/deny-list/ip-deny-list.ts
var baseUrl = "https://raw.githubusercontent.com/stamparm/ipsum/master/levels";
var ThresholdError = class extends Error {
    constructor(threshold){
        super(`Allowed threshold values are from 1 to 8, 1 and 8 included. Received: ${threshold}`);
        this.name = "ThresholdError";
    }
};
var getIpDenyList = async (threshold)=>{
    if (typeof threshold !== "number" || threshold < 1 || threshold > 8) {
        throw new ThresholdError(threshold);
    }
    try {
        const response = await fetch(`${baseUrl}/${threshold}.txt`);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.text();
        const lines = data.split("\n");
        return lines.filter((value)=>value.length > 0);
    } catch (error) {
        throw new Error(`Failed to fetch ip deny list: ${error}`);
    }
};
var updateIpDenyList = async (redis, prefix, threshold, ttl)=>{
    const allIps = await getIpDenyList(threshold);
    const allDenyLists = [
        prefix,
        DenyListExtension,
        "all"
    ].join(":");
    const ipDenyList = [
        prefix,
        DenyListExtension,
        IpDenyListKey
    ].join(":");
    const statusKey = [
        prefix,
        IpDenyListStatusKey
    ].join(":");
    const transaction = redis.multi();
    transaction.sdiffstore(allDenyLists, allDenyLists, ipDenyList);
    transaction.del(ipDenyList);
    transaction.sadd(ipDenyList, ...allIps);
    transaction.sdiffstore(ipDenyList, ipDenyList, allDenyLists);
    transaction.sunionstore(allDenyLists, allDenyLists, ipDenyList);
    transaction.set(statusKey, "valid", {
        px: ttl ?? getIpListTTL()
    });
    return await transaction.exec();
};
var disableIpDenyList = async (redis, prefix)=>{
    const allDenyListsKey = [
        prefix,
        DenyListExtension,
        "all"
    ].join(":");
    const ipDenyListKey = [
        prefix,
        DenyListExtension,
        IpDenyListKey
    ].join(":");
    const statusKey = [
        prefix,
        IpDenyListStatusKey
    ].join(":");
    const transaction = redis.multi();
    transaction.sdiffstore(allDenyListsKey, allDenyListsKey, ipDenyListKey);
    transaction.del(ipDenyListKey);
    transaction.set(statusKey, "disabled");
    return await transaction.exec();
};
// src/deny-list/deny-list.ts
var denyListCache = new Cache(/* @__PURE__ */ new Map());
var checkDenyListCache = (members)=>{
    return members.find((member)=>denyListCache.isBlocked(member).blocked);
};
var blockMember = (member)=>{
    if (denyListCache.size() > 1e3) denyListCache.empty();
    denyListCache.blockUntil(member, Date.now() + 6e4);
};
var checkDenyList = async (redis, prefix, members)=>{
    const [deniedValues, ipDenyListStatus] = await redis.eval(checkDenyListScript, [
        [
            prefix,
            DenyListExtension,
            "all"
        ].join(":"),
        [
            prefix,
            IpDenyListStatusKey
        ].join(":")
    ], members);
    let deniedValue = void 0;
    deniedValues.map((memberDenied, index)=>{
        if (memberDenied) {
            blockMember(members[index]);
            deniedValue = members[index];
        }
    });
    return {
        deniedValue,
        invalidIpDenyList: ipDenyListStatus === -2
    };
};
var resolveLimitPayload = (redis, prefix, [ratelimitResponse, denyListResponse], threshold)=>{
    if (denyListResponse.deniedValue) {
        ratelimitResponse.success = false;
        ratelimitResponse.remaining = 0;
        ratelimitResponse.reason = "denyList";
        ratelimitResponse.deniedValue = denyListResponse.deniedValue;
    }
    if (denyListResponse.invalidIpDenyList) {
        const updatePromise = updateIpDenyList(redis, prefix, threshold);
        ratelimitResponse.pending = Promise.all([
            ratelimitResponse.pending,
            updatePromise
        ]);
    }
    return ratelimitResponse;
};
var defaultDeniedResponse = (deniedValue)=>{
    return {
        success: false,
        limit: 0,
        remaining: 0,
        reset: 0,
        pending: Promise.resolve(),
        reason: "denyList",
        deniedValue
    };
};
// src/ratelimit.ts
var Ratelimit = class {
    constructor(config){
        /**
   * Determine if a request should pass or be rejected based on the identifier and previously chosen ratelimit.
   *
   * Use this if you want to reject all requests that you can not handle right now.
   *
   * @example
   * ```ts
   *  const ratelimit = new Ratelimit({
   *    redis: Redis.fromEnv(),
   *    limiter: Ratelimit.slidingWindow(10, "10 s")
   *  })
   *
   *  const { success } = await ratelimit.limit(id)
   *  if (!success){
   *    return "Nope"
   *  }
   *  return "Yes"
   * ```
   *
   * @param req.rate - The rate at which tokens will be added or consumed from the token bucket. A higher rate allows for more requests to be processed. Defaults to 1 token per interval if not specified.
   *
   * Usage with `req.rate`
   * @example
   * ```ts
   *  const ratelimit = new Ratelimit({
   *    redis: Redis.fromEnv(),
   *    limiter: Ratelimit.slidingWindow(100, "10 s")
   *  })
   *
   *  const { success } = await ratelimit.limit(id, {rate: 10})
   *  if (!success){
   *    return "Nope"
   *  }
   *  return "Yes"
   * ```
   */ this.limit = async (identifier, req)=>{
            let timeoutId = null;
            try {
                const response = this.getRatelimitResponse(identifier, req);
                const { responseArray, newTimeoutId } = this.applyTimeout(response);
                timeoutId = newTimeoutId;
                const timedResponse = await Promise.race(responseArray);
                const finalResponse = this.submitAnalytics(timedResponse, identifier, req);
                return finalResponse;
            } finally{
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            }
        };
        /**
   * Block until the request may pass or timeout is reached.
   *
   * This method returns a promise that resolves as soon as the request may be processed
   * or after the timeout has been reached.
   *
   * Use this if you want to delay the request until it is ready to get processed.
   *
   * @example
   * ```ts
   *  const ratelimit = new Ratelimit({
   *    redis: Redis.fromEnv(),
   *    limiter: Ratelimit.slidingWindow(10, "10 s")
   *  })
   *
   *  const { success } = await ratelimit.blockUntilReady(id, 60_000)
   *  if (!success){
   *    return "Nope"
   *  }
   *  return "Yes"
   * ```
   */ this.blockUntilReady = async (identifier, timeout)=>{
            if (timeout <= 0) {
                throw new Error("timeout must be positive");
            }
            let res;
            const deadline = Date.now() + timeout;
            while(true){
                res = await this.limit(identifier);
                if (res.success) {
                    break;
                }
                if (res.reset === 0) {
                    throw new Error("This should not happen");
                }
                const wait = Math.min(res.reset, deadline) - Date.now();
                await new Promise((r)=>setTimeout(r, wait));
                if (Date.now() > deadline) {
                    break;
                }
            }
            return res;
        };
        this.resetUsedTokens = async (identifier)=>{
            const pattern = [
                this.prefix,
                identifier
            ].join(":");
            await this.limiter().resetTokens(this.ctx, pattern);
        };
        this.getRemaining = async (identifier)=>{
            const pattern = [
                this.prefix,
                identifier
            ].join(":");
            return await this.limiter().getRemaining(this.ctx, pattern);
        };
        /**
   * Checks if the identifier or the values in req are in the deny list cache.
   * If so, returns the default denied response.
   * 
   * Otherwise, calls redis to check the rate limit and deny list. Returns after
   * resolving the result. Resolving is overriding the rate limit result if
   * the some value is in deny list.
   * 
   * @param identifier identifier to block
   * @param req options with ip, user agent, country, rate and geo info
   * @returns rate limit response
   */ this.getRatelimitResponse = async (identifier, req)=>{
            const key = this.getKey(identifier);
            const definedMembers = this.getDefinedMembers(identifier, req);
            const deniedValue = checkDenyListCache(definedMembers);
            let result;
            if (deniedValue) {
                result = [
                    defaultDeniedResponse(deniedValue),
                    {
                        deniedValue,
                        invalidIpDenyList: false
                    }
                ];
            } else {
                result = await Promise.all([
                    this.limiter().limit(this.ctx, key, req?.rate),
                    this.enableProtection ? checkDenyList(this.primaryRedis, this.prefix, definedMembers) : {
                        deniedValue: void 0,
                        invalidIpDenyList: false
                    }
                ]);
            }
            return resolveLimitPayload(this.primaryRedis, this.prefix, result, this.denyListThreshold);
        };
        /**
   * Creates an array with the original response promise and a timeout promise
   * if this.timeout > 0.
   * 
   * @param response Ratelimit response promise
   * @returns array with the response and timeout promise. also includes the timeout id
   */ this.applyTimeout = (response)=>{
            let newTimeoutId = null;
            const responseArray = [
                response
            ];
            if (this.timeout > 0) {
                const timeoutResponse = new Promise((resolve)=>{
                    newTimeoutId = setTimeout(()=>{
                        resolve({
                            success: true,
                            limit: 0,
                            remaining: 0,
                            reset: 0,
                            pending: Promise.resolve(),
                            reason: "timeout"
                        });
                    }, this.timeout);
                });
                responseArray.push(timeoutResponse);
            }
            return {
                responseArray,
                newTimeoutId
            };
        };
        /**
   * submits analytics if this.analytics is set
   * 
   * @param ratelimitResponse final rate limit response
   * @param identifier identifier to submit
   * @param req limit options
   * @returns rate limit response after updating the .pending field
   */ this.submitAnalytics = (ratelimitResponse, identifier, req)=>{
            if (this.analytics) {
                try {
                    const geo = req ? this.analytics.extractGeo(req) : void 0;
                    const analyticsP = this.analytics.record({
                        identifier: ratelimitResponse.reason === "denyList" ? ratelimitResponse.deniedValue : identifier,
                        time: Date.now(),
                        success: ratelimitResponse.reason === "denyList" ? "denied" : ratelimitResponse.success,
                        ...geo
                    }).catch((err)=>{
                        let errorMessage = "Failed to record analytics";
                        if (`${err}`.includes("WRONGTYPE")) {
                            errorMessage = `
    Failed to record analytics. See the information below:

    This can occur when you uprade to Ratelimit version 1.1.2
    or later from an earlier version.

    This occurs simply because the way we store analytics data
    has changed. To avoid getting this error, disable analytics
    for *an hour*, then simply enable it back.

    `;
                        }
                        ;
                    });
                    ratelimitResponse.pending = Promise.all([
                        ratelimitResponse.pending,
                        analyticsP
                    ]);
                } catch (err) {
                    ;
                }
                ;
            }
            ;
            return ratelimitResponse;
        };
        this.getKey = (identifier)=>{
            return [
                this.prefix,
                identifier
            ].join(":");
        };
        /**
   * returns a list of defined values from
   * [identifier, req.ip, req.userAgent, req.country]
   * 
   * @param identifier identifier
   * @param req limit options
   * @returns list of defined values
   */ this.getDefinedMembers = (identifier, req)=>{
            const members = [
                identifier,
                req?.ip,
                req?.userAgent,
                req?.country
            ];
            return members.filter((item)=>Boolean(item));
        };
        this.ctx = config.ctx;
        this.limiter = config.limiter;
        this.timeout = config.timeout ?? 5e3;
        this.prefix = config.prefix ?? "@upstash/ratelimit";
        this.enableProtection = config.enableProtection ?? false;
        this.denyListThreshold = config.denyListThreshold ?? 6;
        this.primaryRedis = "redis" in this.ctx ? this.ctx.redis : this.ctx.regionContexts[0].redis;
        this.analytics = config.analytics ? new Analytics({
            redis: this.primaryRedis,
            prefix: this.prefix
        }) : void 0;
        if (config.ephemeralCache instanceof Map) {
            this.ctx.cache = new Cache(config.ephemeralCache);
        } else if (typeof config.ephemeralCache === "undefined") {
            this.ctx.cache = new Cache(/* @__PURE__ */ new Map());
        }
    }
};
// src/multi.ts
function randomId() {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for(let i = 0; i < 16; i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
var MultiRegionRatelimit = class extends Ratelimit {
    /**
   * Create a new Ratelimit instance by providing a `@upstash/redis` instance and the algorithn of your choice.
   */ constructor(config){
        super({
            prefix: config.prefix,
            limiter: config.limiter,
            timeout: config.timeout,
            analytics: config.analytics,
            ctx: {
                regionContexts: config.redis.map((redis)=>({
                        redis,
                        scriptHashes: {},
                        cacheScripts: config.cacheScripts ?? true
                    })),
                cache: config.ephemeralCache ? new Cache(config.ephemeralCache) : void 0
            }
        });
    }
    /**
   * Each request inside a fixed time increases a counter.
   * Once the counter reaches the maximum allowed number, all further requests are
   * rejected.
   *
   * **Pro:**
   *
   * - Newer requests are not starved by old ones.
   * - Low storage cost.
   *
   * **Con:**
   *
   * A burst of requests near the boundary of a window can result in a very
   * high request rate because two windows will be filled with requests quickly.
   *
   * @param tokens - How many requests a user can make in each time window.
   * @param window - A fixed timeframe
   */ static fixedWindow(tokens, window) {
        const windowDuration = ms(window);
        return ()=>({
                async limit (ctx, identifier, rate) {
                    if (ctx.cache) {
                        const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
                        if (blocked) {
                            return {
                                success: false,
                                limit: tokens,
                                remaining: 0,
                                reset: reset2,
                                pending: Promise.resolve(),
                                reason: "cacheBlock"
                            };
                        }
                    }
                    const requestId = randomId();
                    const bucket = Math.floor(Date.now() / windowDuration);
                    const key = [
                        identifier,
                        bucket
                    ].join(":");
                    const incrementBy = rate ? Math.max(1, rate) : 1;
                    const dbs = ctx.regionContexts.map((regionContext)=>({
                            redis: regionContext.redis,
                            request: safeEval(regionContext, fixedWindowLimitScript, "limitHash", [
                                key
                            ], [
                                requestId,
                                windowDuration,
                                incrementBy
                            ])
                        }));
                    const firstResponse = await Promise.any(dbs.map((s)=>s.request));
                    const usedTokens = firstResponse.reduce((accTokens, usedToken, index)=>{
                        let parsedToken = 0;
                        if (index % 2) {
                            parsedToken = Number.parseInt(usedToken);
                        }
                        return accTokens + parsedToken;
                    }, 0);
                    const remaining = tokens - usedTokens;
                    async function sync() {
                        const individualIDs = await Promise.all(dbs.map((s)=>s.request));
                        const allIDs = Array.from(new Set(individualIDs.flatMap((_)=>_).reduce((acc, curr, index)=>{
                            if (index % 2 === 0) {
                                acc.push(curr);
                            }
                            return acc;
                        }, [])).values());
                        for (const db of dbs){
                            const usedDbTokens = (await db.request).reduce((accTokens, usedToken, index)=>{
                                let parsedToken = 0;
                                if (index % 2) {
                                    parsedToken = Number.parseInt(usedToken);
                                }
                                return accTokens + parsedToken;
                            }, 0);
                            const dbIds = (await db.request).reduce((ids, currentId, index)=>{
                                if (index % 2 === 0) {
                                    ids.push(currentId);
                                }
                                return ids;
                            }, []);
                            if (usedDbTokens >= tokens) {
                                continue;
                            }
                            const diff = allIDs.filter((id)=>!dbIds.includes(id));
                            if (diff.length === 0) {
                                continue;
                            }
                            for (const requestId2 of diff){
                                await db.redis.hset(key, {
                                    [requestId2]: incrementBy
                                });
                            }
                        }
                    }
                    const success = remaining > 0;
                    const reset = (bucket + 1) * windowDuration;
                    if (ctx.cache && !success) {
                        ctx.cache.blockUntil(identifier, reset);
                    }
                    return {
                        success,
                        limit: tokens,
                        remaining,
                        reset,
                        pending: sync()
                    };
                },
                async getRemaining (ctx, identifier) {
                    const bucket = Math.floor(Date.now() / windowDuration);
                    const key = [
                        identifier,
                        bucket
                    ].join(":");
                    const dbs = ctx.regionContexts.map((regionContext)=>({
                            redis: regionContext.redis,
                            request: safeEval(regionContext, fixedWindowRemainingTokensScript, "getRemainingHash", [
                                key
                            ], [
                                null
                            ])
                        }));
                    const firstResponse = await Promise.any(dbs.map((s)=>s.request));
                    const usedTokens = firstResponse.reduce((accTokens, usedToken, index)=>{
                        let parsedToken = 0;
                        if (index % 2) {
                            parsedToken = Number.parseInt(usedToken);
                        }
                        return accTokens + parsedToken;
                    }, 0);
                    return Math.max(0, tokens - usedTokens);
                },
                async resetTokens (ctx, identifier) {
                    const pattern = [
                        identifier,
                        "*"
                    ].join(":");
                    if (ctx.cache) {
                        ctx.cache.pop(identifier);
                    }
                    await Promise.all(ctx.regionContexts.map((regionContext)=>{
                        safeEval(regionContext, resetScript, "resetHash", [
                            pattern
                        ], [
                            null
                        ]);
                    }));
                }
            });
    }
    /**
   * Combined approach of `slidingLogs` and `fixedWindow` with lower storage
   * costs than `slidingLogs` and improved boundary behavior by calculating a
   * weighted score between two windows.
   *
   * **Pro:**
   *
   * Good performance allows this to scale to very high loads.
   *
   * **Con:**
   *
   * Nothing major.
   *
   * @param tokens - How many requests a user can make in each time window.
   * @param window - The duration in which the user can max X requests.
   */ static slidingWindow(tokens, window) {
        const windowSize = ms(window);
        const windowDuration = ms(window);
        return ()=>({
                async limit (ctx, identifier, rate) {
                    if (ctx.cache) {
                        const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
                        if (blocked) {
                            return {
                                success: false,
                                limit: tokens,
                                remaining: 0,
                                reset: reset2,
                                pending: Promise.resolve(),
                                reason: "cacheBlock"
                            };
                        }
                    }
                    const requestId = randomId();
                    const now = Date.now();
                    const currentWindow = Math.floor(now / windowSize);
                    const currentKey = [
                        identifier,
                        currentWindow
                    ].join(":");
                    const previousWindow = currentWindow - 1;
                    const previousKey = [
                        identifier,
                        previousWindow
                    ].join(":");
                    const incrementBy = rate ? Math.max(1, rate) : 1;
                    const dbs = ctx.regionContexts.map((regionContext)=>({
                            redis: regionContext.redis,
                            request: safeEval(regionContext, slidingWindowLimitScript, "limitHash", [
                                currentKey,
                                previousKey
                            ], [
                                tokens,
                                now,
                                windowDuration,
                                requestId,
                                incrementBy
                            ])
                        }));
                    const percentageInCurrent = now % windowDuration / windowDuration;
                    const [current, previous, success] = await Promise.any(dbs.map((s)=>s.request));
                    if (success) {
                        current.push(requestId, incrementBy.toString());
                    }
                    const previousUsedTokens = previous.reduce((accTokens, usedToken, index)=>{
                        let parsedToken = 0;
                        if (index % 2) {
                            parsedToken = Number.parseInt(usedToken);
                        }
                        return accTokens + parsedToken;
                    }, 0);
                    const currentUsedTokens = current.reduce((accTokens, usedToken, index)=>{
                        let parsedToken = 0;
                        if (index % 2) {
                            parsedToken = Number.parseInt(usedToken);
                        }
                        return accTokens + parsedToken;
                    }, 0);
                    const previousPartialUsed = Math.ceil(previousUsedTokens * (1 - percentageInCurrent));
                    const usedTokens = previousPartialUsed + currentUsedTokens;
                    const remaining = tokens - usedTokens;
                    async function sync() {
                        const res = await Promise.all(dbs.map((s)=>s.request));
                        const allCurrentIds = Array.from(new Set(res.flatMap(([current2])=>current2).reduce((acc, curr, index)=>{
                            if (index % 2 === 0) {
                                acc.push(curr);
                            }
                            return acc;
                        }, [])).values());
                        for (const db of dbs){
                            const [current2, _previous, _success] = await db.request;
                            const dbIds = current2.reduce((ids, currentId, index)=>{
                                if (index % 2 === 0) {
                                    ids.push(currentId);
                                }
                                return ids;
                            }, []);
                            const usedDbTokens = current2.reduce((accTokens, usedToken, index)=>{
                                let parsedToken = 0;
                                if (index % 2) {
                                    parsedToken = Number.parseInt(usedToken);
                                }
                                return accTokens + parsedToken;
                            }, 0);
                            if (usedDbTokens >= tokens) {
                                continue;
                            }
                            const diff = allCurrentIds.filter((id)=>!dbIds.includes(id));
                            if (diff.length === 0) {
                                continue;
                            }
                            for (const requestId2 of diff){
                                await db.redis.hset(currentKey, {
                                    [requestId2]: incrementBy
                                });
                            }
                        }
                    }
                    const reset = (currentWindow + 1) * windowDuration;
                    if (ctx.cache && !success) {
                        ctx.cache.blockUntil(identifier, reset);
                    }
                    return {
                        success: Boolean(success),
                        limit: tokens,
                        remaining: Math.max(0, remaining),
                        reset,
                        pending: sync()
                    };
                },
                async getRemaining (ctx, identifier) {
                    const now = Date.now();
                    const currentWindow = Math.floor(now / windowSize);
                    const currentKey = [
                        identifier,
                        currentWindow
                    ].join(":");
                    const previousWindow = currentWindow - 1;
                    const previousKey = [
                        identifier,
                        previousWindow
                    ].join(":");
                    const dbs = ctx.regionContexts.map((regionContext)=>({
                            redis: regionContext.redis,
                            request: safeEval(regionContext, slidingWindowRemainingTokensScript, "getRemainingHash", [
                                currentKey,
                                previousKey
                            ], [
                                now,
                                windowSize
                            ])
                        }));
                    const usedTokens = await Promise.any(dbs.map((s)=>s.request));
                    return Math.max(0, tokens - usedTokens);
                },
                async resetTokens (ctx, identifier) {
                    const pattern = [
                        identifier,
                        "*"
                    ].join(":");
                    if (ctx.cache) {
                        ctx.cache.pop(identifier);
                    }
                    await Promise.all(ctx.regionContexts.map((regionContext)=>{
                        safeEval(regionContext, resetScript, "resetHash", [
                            pattern
                        ], [
                            null
                        ]);
                    }));
                }
            });
    }
};
// src/lua-scripts/single.ts
var fixedWindowLimitScript2 = `
  local key           = KEYS[1]
  local window        = ARGV[1]
  local incrementBy   = ARGV[2] -- increment rate per request at a given value, default is 1

  local r = redis.call("INCRBY", key, incrementBy)
  if r == tonumber(incrementBy) then
  -- The first time this key is set, the value will be equal to incrementBy.
  -- So we only need the expire command once
  redis.call("PEXPIRE", key, window)
  end

  return r
`;
var fixedWindowRemainingTokensScript2 = `
      local key = KEYS[1]
      local tokens = 0

      local value = redis.call('GET', key)
      if value then
          tokens = value
      end
      return tokens
    `;
var slidingWindowLimitScript2 = `
  local currentKey  = KEYS[1]           -- identifier including prefixes
  local previousKey = KEYS[2]           -- key of the previous bucket
  local tokens      = tonumber(ARGV[1]) -- tokens per window
  local now         = ARGV[2]           -- current timestamp in milliseconds
  local window      = ARGV[3]           -- interval in milliseconds
  local incrementBy = ARGV[4]           -- increment rate per request at a given value, default is 1

  local requestsInCurrentWindow = redis.call("GET", currentKey)
  if requestsInCurrentWindow == false then
    requestsInCurrentWindow = 0
  end

  local requestsInPreviousWindow = redis.call("GET", previousKey)
  if requestsInPreviousWindow == false then
    requestsInPreviousWindow = 0
  end
  local percentageInCurrent = ( now % window ) / window
  -- weighted requests to consider from the previous window
  requestsInPreviousWindow = math.floor(( 1 - percentageInCurrent ) * requestsInPreviousWindow)
  if requestsInPreviousWindow + requestsInCurrentWindow >= tokens then
    return -1
  end

  local newValue = redis.call("INCRBY", currentKey, incrementBy)
  if newValue == tonumber(incrementBy) then
    -- The first time this key is set, the value will be equal to incrementBy.
    -- So we only need the expire command once
    redis.call("PEXPIRE", currentKey, window * 2 + 1000) -- Enough time to overlap with a new window + 1 second
  end
  return tokens - ( newValue + requestsInPreviousWindow )
`;
var slidingWindowRemainingTokensScript2 = `
  local currentKey  = KEYS[1]           -- identifier including prefixes
  local previousKey = KEYS[2]           -- key of the previous bucket
  local now         = ARGV[1]           -- current timestamp in milliseconds
  local window      = ARGV[2]           -- interval in milliseconds

  local requestsInCurrentWindow = redis.call("GET", currentKey)
  if requestsInCurrentWindow == false then
    requestsInCurrentWindow = 0
  end

  local requestsInPreviousWindow = redis.call("GET", previousKey)
  if requestsInPreviousWindow == false then
    requestsInPreviousWindow = 0
  end

  local percentageInCurrent = ( now % window ) / window
  -- weighted requests to consider from the previous window
  requestsInPreviousWindow = math.floor(( 1 - percentageInCurrent ) * requestsInPreviousWindow)

  return requestsInPreviousWindow + requestsInCurrentWindow
`;
var tokenBucketLimitScript = `
  local key         = KEYS[1]           -- identifier including prefixes
  local maxTokens   = tonumber(ARGV[1]) -- maximum number of tokens
  local interval    = tonumber(ARGV[2]) -- size of the window in milliseconds
  local refillRate  = tonumber(ARGV[3]) -- how many tokens are refilled after each interval
  local now         = tonumber(ARGV[4]) -- current timestamp in milliseconds
  local incrementBy = tonumber(ARGV[5]) -- how many tokens to consume, default is 1
        
  local bucket = redis.call("HMGET", key, "refilledAt", "tokens")
        
  local refilledAt
  local tokens

  if bucket[1] == false then
    refilledAt = now
    tokens = maxTokens
  else
    refilledAt = tonumber(bucket[1])
    tokens = tonumber(bucket[2])
  end
        
  if now >= refilledAt + interval then
    local numRefills = math.floor((now - refilledAt) / interval)
    tokens = math.min(maxTokens, tokens + numRefills * refillRate)

    refilledAt = refilledAt + numRefills * interval
  end

  if tokens == 0 then
    return {-1, refilledAt + interval}
  end

  local remaining = tokens - incrementBy
  local expireAt = math.ceil(((maxTokens - remaining) / refillRate)) * interval
        
  redis.call("HSET", key, "refilledAt", refilledAt, "tokens", remaining)
  redis.call("PEXPIRE", key, expireAt)
  return {remaining, refilledAt + interval}
`;
var tokenBucketRemainingTokensScript = `
  local key         = KEYS[1]
  local maxTokens   = tonumber(ARGV[1])
        
  local bucket = redis.call("HMGET", key, "tokens")

  if bucket[1] == false then
    return maxTokens
  end
        
  return tonumber(bucket[1])
`;
var cachedFixedWindowLimitScript = `
  local key     = KEYS[1]
  local window  = ARGV[1]
  local incrementBy   = ARGV[2] -- increment rate per request at a given value, default is 1

  local r = redis.call("INCRBY", key, incrementBy)
  if r == incrementBy then
  -- The first time this key is set, the value will be equal to incrementBy.
  -- So we only need the expire command once
  redis.call("PEXPIRE", key, window)
  end
      
  return r
`;
var cachedFixedWindowRemainingTokenScript = `
  local key = KEYS[1]
  local tokens = 0

  local value = redis.call('GET', key)
  if value then
      tokens = value
  end
  return tokens
`;
// src/single.ts
var RegionRatelimit = class extends Ratelimit {
    /**
   * Create a new Ratelimit instance by providing a `@upstash/redis` instance and the algorithm of your choice.
   */ constructor(config){
        super({
            prefix: config.prefix,
            limiter: config.limiter,
            timeout: config.timeout,
            analytics: config.analytics,
            ctx: {
                redis: config.redis,
                scriptHashes: {},
                cacheScripts: config.cacheScripts ?? true
            },
            ephemeralCache: config.ephemeralCache,
            enableProtection: config.enableProtection,
            denyListThreshold: config.denyListThreshold
        });
    }
    /**
   * Each request inside a fixed time increases a counter.
   * Once the counter reaches the maximum allowed number, all further requests are
   * rejected.
   *
   * **Pro:**
   *
   * - Newer requests are not starved by old ones.
   * - Low storage cost.
   *
   * **Con:**
   *
   * A burst of requests near the boundary of a window can result in a very
   * high request rate because two windows will be filled with requests quickly.
   *
   * @param tokens - How many requests a user can make in each time window.
   * @param window - A fixed timeframe
   */ static fixedWindow(tokens, window) {
        const windowDuration = ms(window);
        return ()=>({
                async limit (ctx, identifier, rate) {
                    const bucket = Math.floor(Date.now() / windowDuration);
                    const key = [
                        identifier,
                        bucket
                    ].join(":");
                    if (ctx.cache) {
                        const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
                        if (blocked) {
                            return {
                                success: false,
                                limit: tokens,
                                remaining: 0,
                                reset: reset2,
                                pending: Promise.resolve(),
                                reason: "cacheBlock"
                            };
                        }
                    }
                    const incrementBy = rate ? Math.max(1, rate) : 1;
                    const usedTokensAfterUpdate = await safeEval(ctx, fixedWindowLimitScript2, "limitHash", [
                        key
                    ], [
                        windowDuration,
                        incrementBy
                    ]);
                    const success = usedTokensAfterUpdate <= tokens;
                    const remainingTokens = Math.max(0, tokens - usedTokensAfterUpdate);
                    const reset = (bucket + 1) * windowDuration;
                    if (ctx.cache && !success) {
                        ctx.cache.blockUntil(identifier, reset);
                    }
                    return {
                        success,
                        limit: tokens,
                        remaining: remainingTokens,
                        reset,
                        pending: Promise.resolve()
                    };
                },
                async getRemaining (ctx, identifier) {
                    const bucket = Math.floor(Date.now() / windowDuration);
                    const key = [
                        identifier,
                        bucket
                    ].join(":");
                    const usedTokens = await safeEval(ctx, fixedWindowRemainingTokensScript2, "getRemainingHash", [
                        key
                    ], [
                        null
                    ]);
                    return Math.max(0, tokens - usedTokens);
                },
                async resetTokens (ctx, identifier) {
                    const pattern = [
                        identifier,
                        "*"
                    ].join(":");
                    if (ctx.cache) {
                        ctx.cache.pop(identifier);
                    }
                    await safeEval(ctx, resetScript, "resetHash", [
                        pattern
                    ], [
                        null
                    ]);
                }
            });
    }
    /**
   * Combined approach of `slidingLogs` and `fixedWindow` with lower storage
   * costs than `slidingLogs` and improved boundary behavior by calculating a
   * weighted score between two windows.
   *
   * **Pro:**
   *
   * Good performance allows this to scale to very high loads.
   *
   * **Con:**
   *
   * Nothing major.
   *
   * @param tokens - How many requests a user can make in each time window.
   * @param window - The duration in which the user can max X requests.
   */ static slidingWindow(tokens, window) {
        const windowSize = ms(window);
        return ()=>({
                async limit (ctx, identifier, rate) {
                    const now = Date.now();
                    const currentWindow = Math.floor(now / windowSize);
                    const currentKey = [
                        identifier,
                        currentWindow
                    ].join(":");
                    const previousWindow = currentWindow - 1;
                    const previousKey = [
                        identifier,
                        previousWindow
                    ].join(":");
                    if (ctx.cache) {
                        const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
                        if (blocked) {
                            return {
                                success: false,
                                limit: tokens,
                                remaining: 0,
                                reset: reset2,
                                pending: Promise.resolve(),
                                reason: "cacheBlock"
                            };
                        }
                    }
                    const incrementBy = rate ? Math.max(1, rate) : 1;
                    const remainingTokens = await safeEval(ctx, slidingWindowLimitScript2, "limitHash", [
                        currentKey,
                        previousKey
                    ], [
                        tokens,
                        now,
                        windowSize,
                        incrementBy
                    ]);
                    const success = remainingTokens >= 0;
                    const reset = (currentWindow + 1) * windowSize;
                    if (ctx.cache && !success) {
                        ctx.cache.blockUntil(identifier, reset);
                    }
                    return {
                        success,
                        limit: tokens,
                        remaining: Math.max(0, remainingTokens),
                        reset,
                        pending: Promise.resolve()
                    };
                },
                async getRemaining (ctx, identifier) {
                    const now = Date.now();
                    const currentWindow = Math.floor(now / windowSize);
                    const currentKey = [
                        identifier,
                        currentWindow
                    ].join(":");
                    const previousWindow = currentWindow - 1;
                    const previousKey = [
                        identifier,
                        previousWindow
                    ].join(":");
                    const usedTokens = await safeEval(ctx, slidingWindowRemainingTokensScript2, "getRemainingHash", [
                        currentKey,
                        previousKey
                    ], [
                        now,
                        windowSize
                    ]);
                    return Math.max(0, tokens - usedTokens);
                },
                async resetTokens (ctx, identifier) {
                    const pattern = [
                        identifier,
                        "*"
                    ].join(":");
                    if (ctx.cache) {
                        ctx.cache.pop(identifier);
                    }
                    await safeEval(ctx, resetScript, "resetHash", [
                        pattern
                    ], [
                        null
                    ]);
                }
            });
    }
    /**
   * You have a bucket filled with `{maxTokens}` tokens that refills constantly
   * at `{refillRate}` per `{interval}`.
   * Every request will remove one token from the bucket and if there is no
   * token to take, the request is rejected.
   *
   * **Pro:**
   *
   * - Bursts of requests are smoothed out and you can process them at a constant
   * rate.
   * - Allows to set a higher initial burst limit by setting `maxTokens` higher
   * than `refillRate`
   */ static tokenBucket(refillRate, interval, maxTokens) {
        const intervalDuration = ms(interval);
        return ()=>({
                async limit (ctx, identifier, rate) {
                    if (ctx.cache) {
                        const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
                        if (blocked) {
                            return {
                                success: false,
                                limit: maxTokens,
                                remaining: 0,
                                reset: reset2,
                                pending: Promise.resolve(),
                                reason: "cacheBlock"
                            };
                        }
                    }
                    const now = Date.now();
                    const incrementBy = rate ? Math.max(1, rate) : 1;
                    const [remaining, reset] = await safeEval(ctx, tokenBucketLimitScript, "limitHash", [
                        identifier
                    ], [
                        maxTokens,
                        intervalDuration,
                        refillRate,
                        now,
                        incrementBy
                    ]);
                    const success = remaining >= 0;
                    if (ctx.cache && !success) {
                        ctx.cache.blockUntil(identifier, reset);
                    }
                    return {
                        success,
                        limit: maxTokens,
                        remaining,
                        reset,
                        pending: Promise.resolve()
                    };
                },
                async getRemaining (ctx, identifier) {
                    const remainingTokens = await safeEval(ctx, tokenBucketRemainingTokensScript, "getRemainingHash", [
                        identifier
                    ], [
                        maxTokens
                    ]);
                    return remainingTokens;
                },
                async resetTokens (ctx, identifier) {
                    const pattern = identifier;
                    if (ctx.cache) {
                        ctx.cache.pop(identifier);
                    }
                    await safeEval(ctx, resetScript, "resetHash", [
                        pattern
                    ], [
                        null
                    ]);
                }
            });
    }
    /**
   * cachedFixedWindow first uses the local cache to decide if a request may pass and then updates
   * it asynchronously.
   * This is experimental and not yet recommended for production use.
   *
   * @experimental
   *
   * Each request inside a fixed time increases a counter.
   * Once the counter reaches the maximum allowed number, all further requests are
   * rejected.
   *
   * **Pro:**
   *
   * - Newer requests are not starved by old ones.
   * - Low storage cost.
   *
   * **Con:**
   *
   * A burst of requests near the boundary of a window can result in a very
   * high request rate because two windows will be filled with requests quickly.
   *
   * @param tokens - How many requests a user can make in each time window.
   * @param window - A fixed timeframe
   */ static cachedFixedWindow(tokens, window) {
        const windowDuration = ms(window);
        return ()=>({
                async limit (ctx, identifier, rate) {
                    if (!ctx.cache) {
                        throw new Error("This algorithm requires a cache");
                    }
                    const bucket = Math.floor(Date.now() / windowDuration);
                    const key = [
                        identifier,
                        bucket
                    ].join(":");
                    const reset = (bucket + 1) * windowDuration;
                    const incrementBy = rate ? Math.max(1, rate) : 1;
                    const hit = typeof ctx.cache.get(key) === "number";
                    if (hit) {
                        const cachedTokensAfterUpdate = ctx.cache.incr(key);
                        const success = cachedTokensAfterUpdate < tokens;
                        const pending = success ? safeEval(ctx, cachedFixedWindowLimitScript, "limitHash", [
                            key
                        ], [
                            windowDuration,
                            incrementBy
                        ]) : Promise.resolve();
                        return {
                            success,
                            limit: tokens,
                            remaining: tokens - cachedTokensAfterUpdate,
                            reset,
                            pending
                        };
                    }
                    const usedTokensAfterUpdate = await safeEval(ctx, cachedFixedWindowLimitScript, "limitHash", [
                        key
                    ], [
                        windowDuration,
                        incrementBy
                    ]);
                    ctx.cache.set(key, usedTokensAfterUpdate);
                    const remaining = tokens - usedTokensAfterUpdate;
                    return {
                        success: remaining >= 0,
                        limit: tokens,
                        remaining,
                        reset,
                        pending: Promise.resolve()
                    };
                },
                async getRemaining (ctx, identifier) {
                    if (!ctx.cache) {
                        throw new Error("This algorithm requires a cache");
                    }
                    const bucket = Math.floor(Date.now() / windowDuration);
                    const key = [
                        identifier,
                        bucket
                    ].join(":");
                    const hit = typeof ctx.cache.get(key) === "number";
                    if (hit) {
                        const cachedUsedTokens = ctx.cache.get(key) ?? 0;
                        return Math.max(0, tokens - cachedUsedTokens);
                    }
                    const usedTokens = await safeEval(ctx, cachedFixedWindowRemainingTokenScript, "getRemainingHash", [
                        key
                    ], [
                        null
                    ]);
                    return Math.max(0, tokens - usedTokens);
                },
                async resetTokens (ctx, identifier) {
                    if (!ctx.cache) {
                        throw new Error("This algorithm requires a cache");
                    }
                    const bucket = Math.floor(Date.now() / windowDuration);
                    const key = [
                        identifier,
                        bucket
                    ].join(":");
                    ctx.cache.pop(key);
                    const pattern = [
                        identifier,
                        "*"
                    ].join(":");
                    await safeEval(ctx, resetScript, "resetHash", [
                        pattern
                    ], [
                        null
                    ]);
                }
            });
    }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (0); //# sourceMappingURL=index.js.map


/***/ }),

/***/ 265:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

(function(root, factory) {
    if (true) {
        // CommonJS
        module.exports = exports = factory();
    } else {}
})(void 0, function() {
    /*globals window, global, require*/ /**
	 * CryptoJS core components.
	 */ var CryptoJS = CryptoJS || function(Math1, undefined) {
        var crypto;
        // Native crypto from window (Browser)
        if (false) {}
        // Native crypto in web worker (Browser)
        if (typeof self !== "undefined" && self.crypto) {
            crypto = self.crypto;
        }
        // Native crypto from worker
        if (typeof globalThis !== "undefined" && globalThis.crypto) {
            crypto = globalThis.crypto;
        }
        // Native (experimental IE 11) crypto from window (Browser)
        if (!crypto && "undefined" !== "undefined" && 0) {}
        // Native crypto from global (NodeJS)
        if (!crypto && typeof __webpack_require__.g !== "undefined" && __webpack_require__.g.crypto) {
            crypto = __webpack_require__.g.crypto;
        }
        // Native crypto import via require (NodeJS)
        if (!crypto && "function" === "function") {
            try {
                crypto = __webpack_require__(480);
            } catch (err) {}
        }
        /*
	     * Cryptographically secure pseudorandom number generator
	     *
	     * As Math.random() is cryptographically not safe to use
	     */ var cryptoSecureRandomInt = function() {
            if (crypto) {
                // Use getRandomValues method (Browser)
                if (typeof crypto.getRandomValues === "function") {
                    try {
                        return crypto.getRandomValues(new Uint32Array(1))[0];
                    } catch (err) {}
                }
                // Use randomBytes method (NodeJS)
                if (typeof crypto.randomBytes === "function") {
                    try {
                        return crypto.randomBytes(4).readInt32LE();
                    } catch (err) {}
                }
            }
            throw new Error("Native crypto module could not be used to get secure random number.");
        };
        /*
	     * Local polyfill of Object.create

	     */ var create = Object.create || function() {
            function F() {}
            return function(obj) {
                var subtype;
                F.prototype = obj;
                subtype = new F();
                F.prototype = null;
                return subtype;
            };
        }();
        /**
	     * CryptoJS namespace.
	     */ var C = {};
        /**
	     * Library namespace.
	     */ var C_lib = C.lib = {};
        /**
	     * Base object for prototypal inheritance.
	     */ var Base = C_lib.Base = function() {
            return {
                /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */ extend: function(overrides) {
                    // Spawn
                    var subtype = create(this);
                    // Augment
                    if (overrides) {
                        subtype.mixIn(overrides);
                    }
                    // Create default initializer
                    if (!subtype.hasOwnProperty("init") || this.init === subtype.init) {
                        subtype.init = function() {
                            subtype.$super.init.apply(this, arguments);
                        };
                    }
                    // Initializer's prototype is the subtype object
                    subtype.init.prototype = subtype;
                    // Reference supertype
                    subtype.$super = this;
                    return subtype;
                },
                /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */ create: function() {
                    var instance = this.extend();
                    instance.init.apply(instance, arguments);
                    return instance;
                },
                /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */ init: function() {},
                /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */ mixIn: function(properties) {
                    for(var propertyName in properties){
                        if (properties.hasOwnProperty(propertyName)) {
                            this[propertyName] = properties[propertyName];
                        }
                    }
                    // IE won't copy toString using the loop above
                    if (properties.hasOwnProperty("toString")) {
                        this.toString = properties.toString;
                    }
                },
                /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */ clone: function() {
                    return this.init.prototype.extend(this);
                }
            };
        }();
        /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */ var WordArray = C_lib.WordArray = Base.extend({
            /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */ init: function(words, sigBytes) {
                words = this.words = words || [];
                if (sigBytes != undefined) {
                    this.sigBytes = sigBytes;
                } else {
                    this.sigBytes = words.length * 4;
                }
            },
            /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */ toString: function(encoder) {
                return (encoder || Hex).stringify(this);
            },
            /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */ concat: function(wordArray) {
                // Shortcuts
                var thisWords = this.words;
                var thatWords = wordArray.words;
                var thisSigBytes = this.sigBytes;
                var thatSigBytes = wordArray.sigBytes;
                // Clamp excess bits
                this.clamp();
                // Concat
                if (thisSigBytes % 4) {
                    // Copy one byte at a time
                    for(var i = 0; i < thatSigBytes; i++){
                        var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                        thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
                    }
                } else {
                    // Copy one word at a time
                    for(var j = 0; j < thatSigBytes; j += 4){
                        thisWords[thisSigBytes + j >>> 2] = thatWords[j >>> 2];
                    }
                }
                this.sigBytes += thatSigBytes;
                // Chainable
                return this;
            },
            /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */ clamp: function() {
                // Shortcuts
                var words = this.words;
                var sigBytes = this.sigBytes;
                // Clamp
                words[sigBytes >>> 2] &= 0xffffffff << 32 - sigBytes % 4 * 8;
                words.length = Math1.ceil(sigBytes / 4);
            },
            /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */ clone: function() {
                var clone = Base.clone.call(this);
                clone.words = this.words.slice(0);
                return clone;
            },
            /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */ random: function(nBytes) {
                var words = [];
                for(var i = 0; i < nBytes; i += 4){
                    words.push(cryptoSecureRandomInt());
                }
                return new WordArray.init(words, nBytes);
            }
        });
        /**
	     * Encoder namespace.
	     */ var C_enc = C.enc = {};
        /**
	     * Hex encoding strategy.
	     */ var Hex = C_enc.Hex = {
            /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */ stringify: function(wordArray) {
                // Shortcuts
                var words = wordArray.words;
                var sigBytes = wordArray.sigBytes;
                // Convert
                var hexChars = [];
                for(var i = 0; i < sigBytes; i++){
                    var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                    hexChars.push((bite >>> 4).toString(16));
                    hexChars.push((bite & 0x0f).toString(16));
                }
                return hexChars.join("");
            },
            /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */ parse: function(hexStr) {
                // Shortcut
                var hexStrLength = hexStr.length;
                // Convert
                var words = [];
                for(var i = 0; i < hexStrLength; i += 2){
                    words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
                }
                return new WordArray.init(words, hexStrLength / 2);
            }
        };
        /**
	     * Latin1 encoding strategy.
	     */ var Latin1 = C_enc.Latin1 = {
            /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */ stringify: function(wordArray) {
                // Shortcuts
                var words = wordArray.words;
                var sigBytes = wordArray.sigBytes;
                // Convert
                var latin1Chars = [];
                for(var i = 0; i < sigBytes; i++){
                    var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                    latin1Chars.push(String.fromCharCode(bite));
                }
                return latin1Chars.join("");
            },
            /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */ parse: function(latin1Str) {
                // Shortcut
                var latin1StrLength = latin1Str.length;
                // Convert
                var words = [];
                for(var i = 0; i < latin1StrLength; i++){
                    words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << 24 - i % 4 * 8;
                }
                return new WordArray.init(words, latin1StrLength);
            }
        };
        /**
	     * UTF-8 encoding strategy.
	     */ var Utf8 = C_enc.Utf8 = {
            /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */ stringify: function(wordArray) {
                try {
                    return decodeURIComponent(escape(Latin1.stringify(wordArray)));
                } catch (e) {
                    throw new Error("Malformed UTF-8 data");
                }
            },
            /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */ parse: function(utf8Str) {
                return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
            }
        };
        /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */ var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
            /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */ reset: function() {
                // Initial values
                this._data = new WordArray.init();
                this._nDataBytes = 0;
            },
            /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */ _append: function(data) {
                // Convert string to WordArray, else assume WordArray already
                if (typeof data == "string") {
                    data = Utf8.parse(data);
                }
                // Append
                this._data.concat(data);
                this._nDataBytes += data.sigBytes;
            },
            /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */ _process: function(doFlush) {
                var processedWords;
                // Shortcuts
                var data = this._data;
                var dataWords = data.words;
                var dataSigBytes = data.sigBytes;
                var blockSize = this.blockSize;
                var blockSizeBytes = blockSize * 4;
                // Count blocks ready
                var nBlocksReady = dataSigBytes / blockSizeBytes;
                if (doFlush) {
                    // Round up to include partial blocks
                    nBlocksReady = Math1.ceil(nBlocksReady);
                } else {
                    // Round down to include only full blocks,
                    // less the number of blocks that must remain in the buffer
                    nBlocksReady = Math1.max((nBlocksReady | 0) - this._minBufferSize, 0);
                }
                // Count words ready
                var nWordsReady = nBlocksReady * blockSize;
                // Count bytes ready
                var nBytesReady = Math1.min(nWordsReady * 4, dataSigBytes);
                // Process blocks
                if (nWordsReady) {
                    for(var offset = 0; offset < nWordsReady; offset += blockSize){
                        // Perform concrete-algorithm logic
                        this._doProcessBlock(dataWords, offset);
                    }
                    // Remove processed words
                    processedWords = dataWords.splice(0, nWordsReady);
                    data.sigBytes -= nBytesReady;
                }
                // Return processed words
                return new WordArray.init(processedWords, nBytesReady);
            },
            /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */ clone: function() {
                var clone = Base.clone.call(this);
                clone._data = this._data.clone();
                return clone;
            },
            _minBufferSize: 0
        });
        /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */ var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
            /**
	         * Configuration options.
	         */ cfg: Base.extend(),
            /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */ init: function(cfg) {
                // Apply config defaults
                this.cfg = this.cfg.extend(cfg);
                // Set initial values
                this.reset();
            },
            /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */ reset: function() {
                // Reset data buffer
                BufferedBlockAlgorithm.reset.call(this);
                // Perform concrete-hasher logic
                this._doReset();
            },
            /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */ update: function(messageUpdate) {
                // Append
                this._append(messageUpdate);
                // Update the hash
                this._process();
                // Chainable
                return this;
            },
            /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */ finalize: function(messageUpdate) {
                // Final message update
                if (messageUpdate) {
                    this._append(messageUpdate);
                }
                // Perform concrete-hasher logic
                var hash = this._doFinalize();
                return hash;
            },
            blockSize: 512 / 32,
            /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */ _createHelper: function(hasher) {
                return function(message, cfg) {
                    return new hasher.init(cfg).finalize(message);
                };
            },
            /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */ _createHmacHelper: function(hasher) {
                return function(message, key) {
                    return new C_algo.HMAC.init(hasher, key).finalize(message);
                };
            }
        });
        /**
	     * Algorithm namespace.
	     */ var C_algo = C.algo = {};
        return C;
    }(Math);
    return CryptoJS;
});


/***/ }),

/***/ 106:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

(function(root, factory) {
    if (true) {
        // CommonJS
        module.exports = exports = factory(__webpack_require__(265));
    } else {}
})(void 0, function(CryptoJS) {
    return CryptoJS.enc.Hex;
});


/***/ }),

/***/ 743:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

(function(root, factory) {
    if (true) {
        // CommonJS
        module.exports = exports = factory(__webpack_require__(265));
    } else {}
})(void 0, function(CryptoJS) {
    (function() {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;
        // Reusable object
        var W = [];
        /**
	     * SHA-1 hash algorithm.
	     */ var SHA1 = C_algo.SHA1 = Hasher.extend({
            _doReset: function() {
                this._hash = new WordArray.init([
                    0x67452301,
                    0xefcdab89,
                    0x98badcfe,
                    0x10325476,
                    0xc3d2e1f0
                ]);
            },
            _doProcessBlock: function(M, offset) {
                // Shortcut
                var H = this._hash.words;
                // Working variables
                var a = H[0];
                var b = H[1];
                var c = H[2];
                var d = H[3];
                var e = H[4];
                // Computation
                for(var i = 0; i < 80; i++){
                    if (i < 16) {
                        W[i] = M[offset + i] | 0;
                    } else {
                        var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                        W[i] = n << 1 | n >>> 31;
                    }
                    var t = (a << 5 | a >>> 27) + e + W[i];
                    if (i < 20) {
                        t += (b & c | ~b & d) + 0x5a827999;
                    } else if (i < 40) {
                        t += (b ^ c ^ d) + 0x6ed9eba1;
                    } else if (i < 60) {
                        t += (b & c | b & d | c & d) - 0x70e44324;
                    } else /* if (i < 80) */ {
                        t += (b ^ c ^ d) - 0x359d3e2a;
                    }
                    e = d;
                    d = c;
                    c = b << 30 | b >>> 2;
                    b = a;
                    a = t;
                }
                // Intermediate hash value
                H[0] = H[0] + a | 0;
                H[1] = H[1] + b | 0;
                H[2] = H[2] + c | 0;
                H[3] = H[3] + d | 0;
                H[4] = H[4] + e | 0;
            },
            _doFinalize: function() {
                // Shortcuts
                var data = this._data;
                var dataWords = data.words;
                var nBitsTotal = this._nDataBytes * 8;
                var nBitsLeft = data.sigBytes * 8;
                // Add padding
                dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
                dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
                dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
                data.sigBytes = dataWords.length * 4;
                // Hash final blocks
                this._process();
                // Return final computed hash
                return this._hash;
            },
            clone: function() {
                var clone = Hasher.clone.call(this);
                clone._hash = this._hash.clone();
                return clone;
            }
        });
        /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA1('message');
	     *     var hash = CryptoJS.SHA1(wordArray);
	     */ C.SHA1 = Hasher._createHelper(SHA1);
        /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA1(message, key);
	     */ C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
    })();
    return CryptoJS.SHA1;
});


/***/ }),

/***/ 492:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// src/index.ts
var src_exports = {};
__export(src_exports, {
    RequestCookies: ()=>RequestCookies,
    ResponseCookies: ()=>ResponseCookies,
    parseCookie: ()=>parseCookie,
    parseSetCookie: ()=>parseSetCookie,
    stringifyCookie: ()=>stringifyCookie
});
module.exports = __toCommonJS(src_exports);
// src/serialize.ts
function stringifyCookie(c) {
    var _a;
    const attrs = [
        "path" in c && c.path && `Path=${c.path}`,
        "expires" in c && (c.expires || c.expires === 0) && `Expires=${(typeof c.expires === "number" ? new Date(c.expires) : c.expires).toUTCString()}`,
        "maxAge" in c && typeof c.maxAge === "number" && `Max-Age=${c.maxAge}`,
        "domain" in c && c.domain && `Domain=${c.domain}`,
        "secure" in c && c.secure && "Secure",
        "httpOnly" in c && c.httpOnly && "HttpOnly",
        "sameSite" in c && c.sameSite && `SameSite=${c.sameSite}`,
        "priority" in c && c.priority && `Priority=${c.priority}`
    ].filter(Boolean);
    return `${c.name}=${encodeURIComponent((_a = c.value) != null ? _a : "")}; ${attrs.join("; ")}`;
}
function parseCookie(cookie) {
    const map = /* @__PURE__ */ new Map();
    for (const pair of cookie.split(/; */)){
        if (!pair) continue;
        const splitAt = pair.indexOf("=");
        if (splitAt === -1) {
            map.set(pair, "true");
            continue;
        }
        const [key, value] = [
            pair.slice(0, splitAt),
            pair.slice(splitAt + 1)
        ];
        try {
            map.set(key, decodeURIComponent(value != null ? value : "true"));
        } catch  {}
    }
    return map;
}
function parseSetCookie(setCookie) {
    if (!setCookie) {
        return void 0;
    }
    const [[name, value], ...attributes] = parseCookie(setCookie);
    const { domain, expires, httponly, maxage, path, samesite, secure, priority } = Object.fromEntries(attributes.map(([key, value2])=>[
            key.toLowerCase(),
            value2
        ]));
    const cookie = {
        name,
        value: decodeURIComponent(value),
        domain,
        ...expires && {
            expires: new Date(expires)
        },
        ...httponly && {
            httpOnly: true
        },
        ...typeof maxage === "string" && {
            maxAge: Number(maxage)
        },
        path,
        ...samesite && {
            sameSite: parseSameSite(samesite)
        },
        ...secure && {
            secure: true
        },
        ...priority && {
            priority: parsePriority(priority)
        }
    };
    return compact(cookie);
}
function compact(t) {
    const newT = {};
    for(const key in t){
        if (t[key]) {
            newT[key] = t[key];
        }
    }
    return newT;
}
var SAME_SITE = [
    "strict",
    "lax",
    "none"
];
function parseSameSite(string) {
    string = string.toLowerCase();
    return SAME_SITE.includes(string) ? string : void 0;
}
var PRIORITY = [
    "low",
    "medium",
    "high"
];
function parsePriority(string) {
    string = string.toLowerCase();
    return PRIORITY.includes(string) ? string : void 0;
}
function splitCookiesString(cookiesString) {
    if (!cookiesString) return [];
    var cookiesStrings = [];
    var pos = 0;
    var start;
    var ch;
    var lastComma;
    var nextStart;
    var cookiesSeparatorFound;
    function skipWhitespace() {
        while(pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))){
            pos += 1;
        }
        return pos < cookiesString.length;
    }
    function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
    }
    while(pos < cookiesString.length){
        start = pos;
        cookiesSeparatorFound = false;
        while(skipWhitespace()){
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
                lastComma = pos;
                pos += 1;
                skipWhitespace();
                nextStart = pos;
                while(pos < cookiesString.length && notSpecialChar()){
                    pos += 1;
                }
                if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                    cookiesSeparatorFound = true;
                    pos = nextStart;
                    cookiesStrings.push(cookiesString.substring(start, lastComma));
                    start = pos;
                } else {
                    pos = lastComma + 1;
                }
            } else {
                pos += 1;
            }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
    }
    return cookiesStrings;
}
// src/request-cookies.ts
var RequestCookies = class {
    constructor(requestHeaders){
        /** @internal */ this._parsed = /* @__PURE__ */ new Map();
        this._headers = requestHeaders;
        const header = requestHeaders.get("cookie");
        if (header) {
            const parsed = parseCookie(header);
            for (const [name, value] of parsed){
                this._parsed.set(name, {
                    name,
                    value
                });
            }
        }
    }
    [Symbol.iterator]() {
        return this._parsed[Symbol.iterator]();
    }
    /**
   * The amount of cookies received from the client
   */ get size() {
        return this._parsed.size;
    }
    get(...args) {
        const name = typeof args[0] === "string" ? args[0] : args[0].name;
        return this._parsed.get(name);
    }
    getAll(...args) {
        var _a;
        const all = Array.from(this._parsed);
        if (!args.length) {
            return all.map(([_, value])=>value);
        }
        const name = typeof args[0] === "string" ? args[0] : (_a = args[0]) == null ? void 0 : _a.name;
        return all.filter(([n])=>n === name).map(([_, value])=>value);
    }
    has(name) {
        return this._parsed.has(name);
    }
    set(...args) {
        const [name, value] = args.length === 1 ? [
            args[0].name,
            args[0].value
        ] : args;
        const map = this._parsed;
        map.set(name, {
            name,
            value
        });
        this._headers.set("cookie", Array.from(map).map(([_, value2])=>stringifyCookie(value2)).join("; "));
        return this;
    }
    /**
   * Delete the cookies matching the passed name or names in the request.
   */ delete(names) {
        const map = this._parsed;
        const result = !Array.isArray(names) ? map.delete(names) : names.map((name)=>map.delete(name));
        this._headers.set("cookie", Array.from(map).map(([_, value])=>stringifyCookie(value)).join("; "));
        return result;
    }
    /**
   * Delete all the cookies in the cookies in the request.
   */ clear() {
        this.delete(Array.from(this._parsed.keys()));
        return this;
    }
    /**
   * Format the cookies in the request as a string for logging
   */ [Symbol.for("edge-runtime.inspect.custom")]() {
        return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
    }
    toString() {
        return [
            ...this._parsed.values()
        ].map((v)=>`${v.name}=${encodeURIComponent(v.value)}`).join("; ");
    }
};
// src/response-cookies.ts
var ResponseCookies = class {
    constructor(responseHeaders){
        /** @internal */ this._parsed = /* @__PURE__ */ new Map();
        var _a, _b, _c;
        this._headers = responseHeaders;
        const setCookie = (_c = (_b = (_a = responseHeaders.getSetCookie) == null ? void 0 : _a.call(responseHeaders)) != null ? _b : responseHeaders.get("set-cookie")) != null ? _c : [];
        const cookieStrings = Array.isArray(setCookie) ? setCookie : splitCookiesString(setCookie);
        for (const cookieString of cookieStrings){
            const parsed = parseSetCookie(cookieString);
            if (parsed) this._parsed.set(parsed.name, parsed);
        }
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-get CookieStore#get} without the Promise.
   */ get(...args) {
        const key = typeof args[0] === "string" ? args[0] : args[0].name;
        return this._parsed.get(key);
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-getAll CookieStore#getAll} without the Promise.
   */ getAll(...args) {
        var _a;
        const all = Array.from(this._parsed.values());
        if (!args.length) {
            return all;
        }
        const key = typeof args[0] === "string" ? args[0] : (_a = args[0]) == null ? void 0 : _a.name;
        return all.filter((c)=>c.name === key);
    }
    has(name) {
        return this._parsed.has(name);
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-set CookieStore#set} without the Promise.
   */ set(...args) {
        const [name, value, cookie] = args.length === 1 ? [
            args[0].name,
            args[0].value,
            args[0]
        ] : args;
        const map = this._parsed;
        map.set(name, normalizeCookie({
            name,
            value,
            ...cookie
        }));
        replace(map, this._headers);
        return this;
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-delete CookieStore#delete} without the Promise.
   */ delete(...args) {
        const [name, path, domain] = typeof args[0] === "string" ? [
            args[0]
        ] : [
            args[0].name,
            args[0].path,
            args[0].domain
        ];
        return this.set({
            name,
            path,
            domain,
            value: "",
            expires: /* @__PURE__ */ new Date(0)
        });
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
    }
    toString() {
        return [
            ...this._parsed.values()
        ].map(stringifyCookie).join("; ");
    }
};
function replace(bag, headers) {
    headers.delete("set-cookie");
    for (const [, value] of bag){
        const serialized = stringifyCookie(value);
        headers.append("set-cookie", serialized);
    }
}
function normalizeCookie(cookie = {
    name: "",
    value: ""
}) {
    if (typeof cookie.expires === "number") {
        cookie.expires = new Date(cookie.expires);
    }
    if (cookie.maxAge) {
        cookie.expires = new Date(Date.now() + cookie.maxAge * 1e3);
    }
    if (cookie.path === null || cookie.path === void 0) {
        cookie.path = "/";
    }
    return cookie;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 842:
/***/ ((module) => {

"use strict";
var __dirname = "/";

(()=>{
    "use strict";
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var e = {};
    (()=>{
        var r = e;
        /*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */ r.parse = parse;
        r.serialize = serialize;
        var i = decodeURIComponent;
        var t = encodeURIComponent;
        var a = /; */;
        var n = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        function parse(e, r) {
            if (typeof e !== "string") {
                throw new TypeError("argument str must be a string");
            }
            var t = {};
            var n = r || {};
            var o = e.split(a);
            var s = n.decode || i;
            for(var p = 0; p < o.length; p++){
                var f = o[p];
                var u = f.indexOf("=");
                if (u < 0) {
                    continue;
                }
                var v = f.substr(0, u).trim();
                var c = f.substr(++u, f.length).trim();
                if ('"' == c[0]) {
                    c = c.slice(1, -1);
                }
                if (undefined == t[v]) {
                    t[v] = tryDecode(c, s);
                }
            }
            return t;
        }
        function serialize(e, r, i) {
            var a = i || {};
            var o = a.encode || t;
            if (typeof o !== "function") {
                throw new TypeError("option encode is invalid");
            }
            if (!n.test(e)) {
                throw new TypeError("argument name is invalid");
            }
            var s = o(r);
            if (s && !n.test(s)) {
                throw new TypeError("argument val is invalid");
            }
            var p = e + "=" + s;
            if (null != a.maxAge) {
                var f = a.maxAge - 0;
                if (isNaN(f) || !isFinite(f)) {
                    throw new TypeError("option maxAge is invalid");
                }
                p += "; Max-Age=" + Math.floor(f);
            }
            if (a.domain) {
                if (!n.test(a.domain)) {
                    throw new TypeError("option domain is invalid");
                }
                p += "; Domain=" + a.domain;
            }
            if (a.path) {
                if (!n.test(a.path)) {
                    throw new TypeError("option path is invalid");
                }
                p += "; Path=" + a.path;
            }
            if (a.expires) {
                if (typeof a.expires.toUTCString !== "function") {
                    throw new TypeError("option expires is invalid");
                }
                p += "; Expires=" + a.expires.toUTCString();
            }
            if (a.httpOnly) {
                p += "; HttpOnly";
            }
            if (a.secure) {
                p += "; Secure";
            }
            if (a.sameSite) {
                var u = typeof a.sameSite === "string" ? a.sameSite.toLowerCase() : a.sameSite;
                switch(u){
                    case true:
                        p += "; SameSite=Strict";
                        break;
                    case "lax":
                        p += "; SameSite=Lax";
                        break;
                    case "strict":
                        p += "; SameSite=Strict";
                        break;
                    case "none":
                        p += "; SameSite=None";
                        break;
                    default:
                        throw new TypeError("option sameSite is invalid");
                }
            }
            return p;
        }
        function tryDecode(e, r) {
            try {
                return r(e);
            } catch (r) {
                return e;
            }
        }
    })();
    module.exports = e;
})();


/***/ }),

/***/ 459:
/***/ ((module) => {

"use strict";
// Note: This file is JS because it's used by the taskfile-swc.js file, which is JS.
// Keep file changes in sync with the corresponding `.d.ts` files.
/**
 * These are the browser versions that support all of the following:
 * static import: https://caniuse.com/es6-module
 * dynamic import: https://caniuse.com/es6-module-dynamic-import
 * import.meta: https://caniuse.com/mdn-javascript_operators_import_meta
 */ 
const MODERN_BROWSERSLIST_TARGET = [
    "chrome 64",
    "edge 79",
    "firefox 67",
    "opera 51",
    "safari 12"
];
module.exports = MODERN_BROWSERSLIST_TARGET; //# sourceMappingURL=modern-browserslist-target.js.map


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__(518));
/******/ (_ENTRIES = typeof _ENTRIES === "undefined" ? {} : _ENTRIES)["middleware_src/middleware"] = __webpack_exports__;
/******/ }
]);
//# sourceMappingURL=middleware.js.map