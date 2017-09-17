/**
 *
 *The MIT License (MIT)
 *
 *Copyright (c) 2010-2016 Robert Kieffer and other contributors
 *
 *Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 *THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */



!function (e) {
    if ("object" == typeof exports && "undefined" != typeof module)module.exports = e(); else if ("function" == typeof define && define.amd)define([], e); else {
        var n;
        "undefined" != typeof window ? n = window : "undefined" != typeof global ? n = global : "undefined" != typeof self && (n = self), n.uuid = e()
    }
}(function () {
    return function e(n, r, o) {
        function t(f, u) {
            if (!r[f]) {
                if (!n[f]) {
                    var a = "function" == typeof require && require;
                    if (!u && a)return a(f, !0);
                    if (i)return i(f, !0);
                    var d = new Error("Cannot find module '" + f + "'");
                    throw d.code = "MODULE_NOT_FOUND", d
                }
                var s = r[f] = {exports: {}};
                n[f][0].call(s.exports, function (e) {
                    var r = n[f][1][e];
                    return t(r ? r : e)
                }, s, s.exports, e, n, r, o)
            }
            return r[f].exports
        }

        for (var i = "function" == typeof require && require, f = 0; f < o.length; f++)t(o[f]);
        return t
    }({
        1: [function (e, n, r) {
            var o = e("./v1"), t = e("./v4"), i = t;
            i.v1 = o, i.v4 = t, n.exports = i
        }, {"./v1": 4, "./v4": 5}], 2: [function (e, n, r) {
            function o(e, n) {
                var r = n || 0, o = t;
                return o[e[r++]] + o[e[r++]] + o[e[r++]] + o[e[r++]] + "-" + o[e[r++]] + o[e[r++]] + "-" + o[e[r++]] + o[e[r++]] + "-" + o[e[r++]] + o[e[r++]] + "-" + o[e[r++]] + o[e[r++]] + o[e[r++]] + o[e[r++]] + o[e[r++]] + o[e[r++]]
            }

            for (var t = [], i = 0; i < 256; ++i)t[i] = (i + 256).toString(16).substr(1);
            n.exports = o
        }, {}], 3: [function (e, n, r) {
            (function (e) {
                var r, o = e.crypto || e.msCrypto;
                if (o && o.getRandomValues) {
                    var t = new Uint8Array(16);
                    r = function () {
                        return o.getRandomValues(t), t
                    }
                }
                if (!r) {
                    var i = new Array(16);
                    r = function () {
                        for (var e, n = 0; n < 16; n++)0 === (3 & n) && (e = 4294967296 * Math.random()), i[n] = e >>> ((3 & n) << 3) & 255;
                        return i
                    }
                }
                n.exports = r
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}], 4: [function (e, n, r) {
            function o(e, n, r) {
                var o = n && r || 0, t = n || [];
                e = e || {};
                var f = void 0 !== e.clockseq ? e.clockseq : a, l = void 0 !== e.msecs ? e.msecs : (new Date).getTime(), c = void 0 !== e.nsecs ? e.nsecs : s + 1, v = l - d + (c - s) / 1e4;
                if (v < 0 && void 0 === e.clockseq && (f = f + 1 & 16383), (v < 0 || l > d) && void 0 === e.nsecs && (c = 0), c >= 1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
                d = l, s = c, a = f, l += 122192928e5;
                var p = (1e4 * (268435455 & l) + c) % 4294967296;
                t[o++] = p >>> 24 & 255, t[o++] = p >>> 16 & 255, t[o++] = p >>> 8 & 255, t[o++] = 255 & p;
                var y = l / 4294967296 * 1e4 & 268435455;
                t[o++] = y >>> 8 & 255, t[o++] = 255 & y, t[o++] = y >>> 24 & 15 | 16, t[o++] = y >>> 16 & 255, t[o++] = f >>> 8 | 128, t[o++] = 255 & f;
                for (var b = e.node || u, w = 0; w < 6; ++w)t[o + w] = b[w];
                return n ? n : i(t)
            }

            var t = e("./lib/rng"), i = e("./lib/bytesToUuid"), f = t(), u = [1 | f[0], f[1], f[2], f[3], f[4], f[5]], a = 16383 & (f[6] << 8 | f[7]), d = 0, s = 0;
            n.exports = o
        }, {"./lib/bytesToUuid": 2, "./lib/rng": 3}], 5: [function (e, n, r) {
            function o(e, n, r) {
                var o = n && r || 0;
                "string" == typeof e && (n = "binary" == e ? new Array(16) : null, e = null), e = e || {};
                var f = e.random || (e.rng || t)();
                if (f[6] = 15 & f[6] | 64, f[8] = 63 & f[8] | 128, n)for (var u = 0; u < 16; ++u)n[o + u] = f[u];
                return n || i(f)
            }

            var t = e("./lib/rng"), i = e("./lib/bytesToUuid");
            n.exports = o
        }, {"./lib/bytesToUuid": 2, "./lib/rng": 3}]
    }, {}, [1])(1)
});