"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userClass = void 0;
class userClass {
    constructor(user) {
        this.account = user;
    }
    deleteHimSelf(req) {
        req.app.locals.users = req.app.locals.users.filter((user) => {
            return user.account.username !== this.account.username;
        });
    }
}
exports.userClass = userClass;
