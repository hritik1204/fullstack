"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrivateIP = isPrivateIP;
function isPrivateIP(host) {
    return (/^127\./.test(host) ||
        /^10\./.test(host) ||
        /^192\.168\./.test(host) ||
        /^::1$/.test(host));
}
