ccm.component({
    name: "user2",
    config: {
        html: [ccm.load, "https://kaul.inf.h-brs.de/ccm/jsonp/user_html.json"],
        sign_on: "hbrsinfkaul",
        context: !0,
        texts: {
            login: "Login",
            login_title: "click here for login",
            logout: "Logout",
            logout_title: "click here for logout",
            username_title: "this is your username"
        }
    },
    Instance: function () {
        function t(t) {
            for (var e = 0; e < o.length; e++)o[e](t)
        }

        var e, n = null, o = [], l = this;
        this.init = function (t) {
            if (l.context) {
                var n = ccm.context.find(l, "user");
                l.context = n && n.context || n
            }
            e = l.sign_on, delete l.sign_on, t()
        }, this.render = function (t) {
            function e() {
                l.login(function () {
                    l.render()
                })
            }

            function n() {
                l.logout(function () {
                    l.render()
                })
            }

            if (l.context)return l.context.render(t);
            var o = ccm.helper.element(l);
            l.isLoggedIn() ? o.html(ccm.helper.html(l.html.logged_in, ccm.helper.val(l.data().key), ccm.helper.val(l.text_username_title), ccm.helper.val(l.text_logout), n, ccm.helper.val(l.text_logout_title))) : o.html(ccm.helper.html(l.html.logged_out, ccm.helper.val(l.text_login), e, ccm.helper.val(l.text_login_title))), l.lang && l.lang.render(), t && t()
        }, this.login = function (o) {
            function i(e, i, c) {
                n = {key: e, token: i, name: c}, ccm.helper.isInDOM(l) && l.render(), o && o(), t(!0)
            }

            if (l.context)return l.context.login(o);
            if (l.isLoggedIn())return void(o && o());
            switch (e) {
                case"demo":
                    ccm.load(["https://kaul.inf.h-brs.de/login/demo_login.php", {realm: "hbrsinfkaul"}], function (t) {
                        i(t.user, t.token)
                    });
                    break;
                case"hbrsinfkaul":
                    ccm.load(["https://kaul.inf.h-brs.de/login/login2.php", {realm: "hbrsinfkaul"}], function (t) {
                        i(t.user, t.token, t.name)
                    })
            }
        }, this.logout = function (o) {
            function i() {
                n = null, ccm.helper.isInDOM(l) && l.render(), o && o(), t(!1)
            }

            if (l.context)return l.context.logout(o);
            if (!l.isLoggedIn())return void(o && o());
            switch (e) {
                case"demo":
                    ccm.load(["https://logout@kaul.inf.h-brs.de/login/demo_logout.php", {realm: "hbrsinfkaul"}]), i();
                    break;
                case"hbrsinfkaul":
                    ccm.load(["https://logout@kaul.inf.h-brs.de/login/logout.php", {realm: "hbrsinfkaul"}]), i()
            }
        }, this.isLoggedIn = function () {
            return l.context ? l.context.isLoggedIn() : !!n
        }, this.data = function () {
            return l.context ? l.context.data() : n
        }, this.addObserver = function (t) {
            return l.context ? l.context.addObserver(t) : void o.push(t)
        }
    }
});