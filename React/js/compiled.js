var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define("React/Models/IDomMeasurement", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DOMMeasurement = /** @class */ (function () {
        function DOMMeasurement(input) {
            if (input.indexOf("%") !== -1) {
                this.Value = parseInt(input.substr(0, input.indexOf("%")), 10);
                this.Unit = "%";
            }
            else if (input.indexOf("%") !== -1) {
                this.Value = parseInt(input.substr(0, input.indexOf("px")), 10);
                this.Unit = "px";
            }
            else {
                this.Value = parseInt(input, 10);
                this.Unit = "px";
            }
        }
        DOMMeasurement.prototype.toString = function () {
            return "" + this.Value + this.Unit;
        };
        ;
        return DOMMeasurement;
    }());
    exports.DOMMeasurement = DOMMeasurement;
});
define("React/Models/Size", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Size = /** @class */ (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        Size.prototype.shortest = function () {
            if (this.width < this.height) {
                return this.width;
            }
            else {
                return this.height;
            }
        };
        Size.prototype.longest = function () {
            if (this.width > this.height) {
                return this.width;
            }
            else {
                return this.height;
            }
        };
        return Size;
    }());
    exports.Size = Size;
});
define("React/Stage/Model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("React/User/Model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("React/TuckmanZone/Model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("React/Tuckman/Model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("React/Models/Polar", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Polar = /** @class */ (function () {
        function Polar(radius, angle) {
            this.radius = radius;
            this.angle = angle;
        }
        return Polar;
    }());
    exports.Polar = Polar;
});
define("React/Models/Point", ["require", "exports", "React/Models/Polar"], function (require, exports, Polar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Point = /** @class */ (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.fromCoords = function (coords) {
            return new Point(coords[0], coords[1]);
        };
        Point.fromOffset = function (point, origin) {
            var dx = point.x - origin.x;
            var dy = point.y - origin.y;
            return new Point(dx, dy);
        };
        Point.toOffset = function (point, origin) {
            var dx = point.x + origin.x;
            var dy = point.y + origin.y;
            return new Point(dx, dy);
        };
        Point.distance = function (point, origin) {
            var offset = Point.fromOffset(point, origin);
            return Point.distanceFromOffset(offset);
        };
        Point.distanceAsPercentage = function (thisDistance, maxDistance) {
            return (thisDistance / maxDistance) * 100;
        };
        Point.distanceFromOffset = function (offset) {
            return Math.sqrt(offset.x * offset.x + offset.y * offset.y);
        };
        Point.toCartesianNoOffset = function (polar) {
            var x = polar.radius * Math.cos(polar.angle);
            var y = polar.radius * Math.sin(polar.angle);
            return new Point(x, y);
        };
        Point.toCartesian = function (polar, origin) {
            var point = Point.toCartesianNoOffset(polar);
            return Point.toOffset(point, origin);
        };
        Point.toPolar = function (point, origin) {
            var offset = Point.fromOffset(point, origin);
            var radius = Point.distanceFromOffset(offset);
            var angle = Math.atan2(offset.y, offset.x);
            return new Polar_1.Polar(radius, angle);
        };
        return Point;
    }());
    exports.Point = Point;
});
define("React/Tuckman/Actions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TuckmanActions = {
        SET_STAGESIZE: "SET_STAGESIZE",
        SET_STAGEVISIBLE: "SET_STAGEVISIBLE",
        SET_ZONEFOCUS: "SET_ZONEFOCUS",
        SET_USERFOCUS: "SET_USERFOCUS",
        SET_USERLIST: "SET_USERLIST",
        SELECT_USER: "SELECT_USER",
        CHOOSE_ZONE: "CHOOSE_ZONE",
        TOGGLE_CHOICES: "TOGGLE_CHOICES"
    };
    function setStageVisibility(visibility) {
        return { type: exports.TuckmanActions.SET_STAGEVISIBLE, visibility: visibility };
    }
    exports.setStageVisibility = setStageVisibility;
    function setStageSize(width, height) {
        return { type: exports.TuckmanActions.SET_STAGESIZE, width: width, height: height };
    }
    exports.setStageSize = setStageSize;
    function setZoneFocus(area, focus) {
        return { type: exports.TuckmanActions.SET_ZONEFOCUS, area: area, focus: focus };
    }
    exports.setZoneFocus = setZoneFocus;
    function setUserFocus(user, focus) {
        return { type: exports.TuckmanActions.SET_USERFOCUS, user: user, focus: focus };
    }
    exports.setUserFocus = setUserFocus;
    function setUserList(userList) {
        return { type: exports.TuckmanActions.SET_USERLIST, userList: userList };
    }
    exports.setUserList = setUserList;
    function selectUser(user) {
        return { type: exports.TuckmanActions.SELECT_USER, user: user };
    }
    exports.selectUser = selectUser;
    function chooseZone(user, area, distance) {
        return { type: exports.TuckmanActions.CHOOSE_ZONE, user: user, area: area, distance: distance };
    }
    exports.chooseZone = chooseZone;
    function toggleChoiceVisibility(visible) {
        return { type: exports.TuckmanActions.TOGGLE_CHOICES, visible: visible };
    }
    exports.toggleChoiceVisibility = toggleChoiceVisibility;
});
define("React/Tuckman/Reducer", ["require", "exports", "../3rdParty/immutable.min", "React/Models/Size", "React/Models/Point", "React/Tuckman/Actions"], function (require, exports, immutable_min_1, Size_1, Point_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var initialSize = new Size_1.Size(800, 800);
    var initialState = {
        UserList: {
            ShowUsers: true,
            Users: [
                { Username: "Adam Hall", Focus: "not-in-focus", Y: 0 },
                { Username: "Caroline Hall", Focus: "not-in-focus", Y: 0 }
            ],
        },
        Size: initialSize,
        onHide: function () {
            return null;
        },
        onShow: function () {
            return null;
        },
        zones: {
            forming: { index: 0, label: "forming", focus: "not-in-focus", Events: undefined, visibility: "appearing" },
            storming: { index: 1, label: "storming", focus: "not-in-focus", Events: undefined, visibility: "appearing" },
            norming: { index: 2, label: "norming", focus: "not-in-focus", Events: undefined, visibility: "appearing" },
            performing: { index: 3, label: "performing", focus: "not-in-focus", Events: undefined, visibility: "appearing" }
        },
        visibility: false,
        UserChoices: []
        /*CenterPoint: new Point(initialSize.width / 2, initialSize.height / 2),
    
        Zones : {
            Comfort: {Name: "Comfort", Focus: "not-in-focus", Range: {Start: 0, End: 100}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
            Stretch: {Name: "Stretch", Focus: "not-in-focus", Range: {Start: 100, End: 200}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
            Chaos: {Name: "Chaos", Focus: "not-in-focus", Range: {Start: 200, End: 300}, Size: {Width: new DOMMeasurement("100%"), Height: new DOMMeasurement("100%")}}
        },
        ShowUserChoices: false,
        */
    };
    function tuckmanReducer(state, action) {
        if (state === void 0) { state = initialState; }
        switch (action.type) {
            case Actions_1.TuckmanActions.SET_STAGESIZE:
                return TuckmanZoneAction.setStageSize(state, action.width, action.height);
            case Actions_1.TuckmanActions.SET_STAGEVISIBLE:
                return TuckmanZoneAction.setStageVisibilty(state, action.visibility);
            case Actions_1.TuckmanActions.SET_USERFOCUS:
                return TuckmanZoneAction.setUserFocus(state, action.user, action.focus);
            case Actions_1.TuckmanActions.SET_ZONEFOCUS:
                return TuckmanZoneAction.setZoneFocus(state, action.area, action.focus);
            case Actions_1.TuckmanActions.SELECT_USER:
                return TuckmanZoneAction.selectUser(state, action.user);
            case Actions_1.TuckmanActions.CHOOSE_ZONE:
                return TuckmanZoneAction.chooseZone(state, action.user, action.area, action.distance);
            case Actions_1.TuckmanActions.TOGGLE_CHOICES:
                return TuckmanZoneAction.toggleChoiceVisibility(state, action.visible);
            default:
                return state;
        }
    }
    exports.tuckmanReducer = tuckmanReducer;
    var TuckmanZoneAction = /** @class */ (function () {
        function TuckmanZoneAction() {
        }
        TuckmanZoneAction.setStageSize = function (state, width, height) {
            var newCenter = new Point_1.Point(width / 2, height / 2);
            return immutable_min_1.fromJS(state)
                .set("Size", new Size_1.Size(width, height))
                .set("CenterPoint", newCenter)
                .toJS();
        };
        TuckmanZoneAction.setStageVisibilty = function (state, visibility) {
            return immutable_min_1.fromJS(state)
                .setIn(["zones", "forming", "visibility"], visibility)
                .setIn(["zones", "storming", "visibility"], visibility)
                .setIn(["zones", "norming", "visibility"], visibility)
                .setIn(["zones", "performing", "visibility"], visibility).toJS();
        };
        TuckmanZoneAction.setZoneFocus = function (state, area, focus) {
            return immutable_min_1.fromJS(state)
                .setIn(["zones", "forming", "focus"], area === "forming" ? focus : "not-in-focus")
                .setIn(["zones", "storming", "focus"], area === "storming" ? focus : "not-in-focus")
                .setIn(["zones", "norming", "focus"], area === "norming" ? focus : "not-in-focus")
                .setIn(["zones", "performing", "focus"], area === "performing" ? focus : "not-in-focus").toJS();
        };
        TuckmanZoneAction.setUserFocus = function (state, user, focus) {
            var originalList = immutable_min_1.List(state.UserList.Users);
            var newUserList = originalList.update(originalList.findIndex(function (item) { return item.Username === user; }), function (item) { return immutable_min_1.fromJS(item).set("Focus", focus); }).toJS();
            return immutable_min_1.fromJS(state)
                .setIn(["UserList", "Users"], newUserList).toJS();
        };
        TuckmanZoneAction.setUsers = function (state, userList) {
            return immutable_min_1.fromJS(state)
                .setIn("UserList", userList).toJS();
        };
        TuckmanZoneAction.selectUser = function (state, user) {
            var originalList = immutable_min_1.List(state.UserList.Users);
            var item = originalList.find(function (item) { return item.Username === user; });
            // Sets currentUser, and therefor hides the user choice menu
            var data = immutable_min_1.fromJS(state)
                .set("CurrentUser", item)
                .set("ShowUserChoices", false)
                .setIn(["UserList", "ShowUsers"], false);
            return data.toJS();
        };
        TuckmanZoneAction.chooseZone = function (state, user, area, distance) {
            // Add the user choice
            var newUserChoices = immutable_min_1.List(state.UserChoices).push({
                User: { Username: user },
                Zone: area,
                Distance: distance
            }).toJS();
            // Remove the user from the choice list
            var newUserList = immutable_min_1.List(state.UserList.Users).filter(function (item) { return item.Username !== user; }).toArray();
            // Show the user list
            var showUserChoice = !!(newUserList.length);
            // Return
            return immutable_min_1.fromJS(state)
                .delete("CurrentUser")
                .set("ShowUserChoices", showUserChoice)
                .set("UserChoices", newUserChoices)
                .setIn(["UserList", "Users"], newUserList)
                .setIn(["UserList", "ShowUsers"], showUserChoice).toJS();
        };
        TuckmanZoneAction.toggleChoiceVisibility = function (state, visible) {
            // Set "showUserChoices" to true
            return immutable_min_1.Map(state)
                .set("visibility", !visible)
                .set("ShowUserChoices", visible).toJS();
        };
        return TuckmanZoneAction;
    }());
});
define("Shared/Cache", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenericCache = /** @class */ (function () {
        function GenericCache() {
            this.store = [];
        }
        GenericCache.prototype.update = function (item) {
            for (var i = 0; i < this.store.length; i++) {
                if (item.id === this.store[i].id) {
                    this.store[i] = item;
                }
            }
            return Promise.resolve(this.store);
        };
        GenericCache.prototype.add = function (item) {
            this.store.push(item);
            return Promise.resolve(this.store);
        };
        GenericCache.prototype.get = function () {
            return Promise.resolve(this.store);
        };
        GenericCache.prototype.getById = function (id) {
            var store = this.store.filter(function (x) { return x.id === id; });
            if (store.length) {
                return Promise.resolve(store[0]);
            }
            throw Error("Cannot find item by ID: " + id);
        };
        GenericCache.prototype.set = function (items) {
            this.store = items;
            return Promise.resolve(this.store);
        };
        return GenericCache;
    }());
    exports.GenericCache = GenericCache;
});
define("Shared/User", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var User = /** @class */ (function () {
        function User(name, id) {
            this.name = name;
            this.id = id;
            this.voted = false;
        }
        return User;
    }());
    exports.User = User;
});
define("Shared/IUsers", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Shared/UserConstructor", ["require", "exports", "Shared/User"], function (require, exports, User_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserConstructor = /** @class */ (function () {
        function UserConstructor() {
        }
        UserConstructor.notEmpty = function (input) {
            return (input !== "");
        };
        UserConstructor.createUsersByNames = function (names) {
            var _this = this;
            var filtered = names.filter(UserConstructor.notEmpty);
            var users = filtered.map(function (v, i) {
                return _this.createUser(v, i);
            });
            return users;
        };
        UserConstructor.createUser = function (name, index) {
            return new User_1.User(name, "user" + index);
        };
        return UserConstructor;
    }());
    exports.UserConstructor = UserConstructor;
});
define("Shared/Users", ["require", "exports", "Shared/Cache", "Shared/UserConstructor"], function (require, exports, Cache_1, UserConstructor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InMemoryUsers = /** @class */ (function () {
        function InMemoryUsers() {
            this.cache = new Cache_1.GenericCache();
            var users = UserConstructor_1.UserConstructor.createUsersByNames([
                "Adam Hall",
                "Billie Davey",
                "Laura Rowe",
                "Simon Dawson"
            ]);
            this.setUsers(users);
        }
        InMemoryUsers.prototype.addUser = function (user) {
            return this.cache.add(user);
        };
        InMemoryUsers.prototype.addUserByName = function (name) {
            return this.cache.add(UserConstructor_1.UserConstructor.createUser(name, 9));
        };
        InMemoryUsers.prototype.updateUser = function (user) {
            return this.cache.update(user);
        };
        InMemoryUsers.prototype.getUsers = function () {
            return this.cache.get();
        };
        InMemoryUsers.prototype.getUser = function (id) {
            return this.cache.getById(id);
        };
        InMemoryUsers.prototype.saveUser = function (user) {
            return this.cache.update(user);
        };
        InMemoryUsers.prototype.setUsers = function (users) {
            return this.cache.set(users);
        };
        return InMemoryUsers;
    }());
    exports.InMemoryUsers = InMemoryUsers;
});
define("Shared/BrowserRepo", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BrowserRepo = /** @class */ (function () {
        function BrowserRepo(key, window) {
            this.br = window;
            this.key = key;
        }
        BrowserRepo.prototype.get = function () {
            var text = this.br.localStorage.getItem(this.key);
            var json = JSON.parse(text);
            return Promise.resolve(json);
        };
        BrowserRepo.prototype.save = function (thing) {
            var text = JSON.stringify(thing);
            this.br.localStorage.setItem(this.key, text);
            return Promise.resolve(thing);
        };
        return BrowserRepo;
    }());
    exports.BrowserRepo = BrowserRepo;
});
define("Shared/BrowserUsers", ["require", "exports", "Shared/BrowserRepo"], function (require, exports, BrowserRepo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BrowserUsers = /** @class */ (function () {
        function BrowserUsers(window) {
            this.repo = new BrowserRepo_1.BrowserRepo("users", window);
        }
        BrowserUsers.prototype.getUsers = function () {
            return this.repo.get();
        };
        BrowserUsers.prototype.saveUsers = function (users) {
            return this.repo.save(users);
        };
        return BrowserUsers;
    }());
    exports.BrowserUsers = BrowserUsers;
});
define("Shared/InMemoryBrowserUsers", ["require", "exports", "Shared/Users", "Shared/BrowserUsers"], function (require, exports, Users_1, BrowserUsers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InMemoryBrowserUsers = /** @class */ (function () {
        function InMemoryBrowserUsers(window) {
            this.cache = new Users_1.InMemoryUsers();
            this.repo = new BrowserUsers_1.BrowserUsers(window);
        }
        InMemoryBrowserUsers.prototype.updateUser = function (user) {
            var _this = this;
            var prom = this.cache.updateUser(user);
            prom.then(function (users) {
                _this.repo.saveUsers(users);
            });
            return prom;
        };
        InMemoryBrowserUsers.prototype.addUser = function (user) {
            var _this = this;
            var prom = this.cache.addUser(user);
            prom.then(function (users) {
                _this.repo.saveUsers(users);
            });
            return prom;
        };
        InMemoryBrowserUsers.prototype.getUsers = function () {
            var _this = this;
            var prom = this.repo.getUsers();
            prom.then(function (users) {
                _this.cache.setUsers(users);
            });
            return prom;
        };
        InMemoryBrowserUsers.prototype.getUser = function (id) {
            var result = this.cache.getUser(id);
            return Promise.resolve(result);
        };
        InMemoryBrowserUsers.prototype.setUsers = function (users) {
            var promCache = this.cache.setUsers(users);
            var promRepo = this.repo.saveUsers(users);
            return promCache;
        };
        return InMemoryBrowserUsers;
    }());
    exports.InMemoryBrowserUsers = InMemoryBrowserUsers;
});
define("React/Comfort/Actions", ["require", "exports", "Shared/InMemoryBrowserUsers"], function (require, exports, InMemoryBrowserUsers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComfortActions = {
        SET_STAGESIZE: "SET_STAGESIZE",
        SET_STAGEVISIBILITY: "SET_STAGEVISIBILITY",
        SET_ZONEFOCUS: "SET_ZONEFOCUS",
        SET_USERFOCUS: "SET_USERFOCUS",
        SET_USERLIST: "SET_USERLIST",
        SELECT_USER: "SELECT_USER",
        CHOOSE_ZONE: "CHOOSE_ZONE",
        TOGGLE_CHOICES: "TOGGLE_CHOICES"
    };
    function setStageSize(width, height) {
        return { type: exports.ComfortActions.SET_STAGESIZE, width: width, height: height };
    }
    exports.setStageSize = setStageSize;
    function setStageVisibility(visibility) {
        return { type: exports.ComfortActions.SET_STAGEVISIBILITY, visibility: visibility };
    }
    exports.setStageVisibility = setStageVisibility;
    function setUserFocus(user, focus) {
        return { type: exports.ComfortActions.SET_USERFOCUS, user: user, focus: focus };
    }
    exports.setUserFocus = setUserFocus;
    function setZoneFocus(area, focus) {
        return { type: exports.ComfortActions.SET_ZONEFOCUS, area: area, focus: focus };
    }
    exports.setZoneFocus = setZoneFocus;
    function selectUser(user) {
        return { type: exports.ComfortActions.SELECT_USER, user: user };
    }
    exports.selectUser = selectUser;
    function chooseZone(user, area, distance) {
        return { type: exports.ComfortActions.CHOOSE_ZONE, user: user, area: area, distance: distance };
    }
    exports.chooseZone = chooseZone;
    function toggleChoiceVisibility(visible) {
        return { type: exports.ComfortActions.TOGGLE_CHOICES, visible: visible };
    }
    exports.toggleChoiceVisibility = toggleChoiceVisibility;
    function recieveUserList(userList) {
        return { type: exports.ComfortActions.SET_USERLIST, userList: userList };
    }
    exports.recieveUserList = recieveUserList;
    function fetchUserList() {
        return function (dispatch) {
            dispatch(recieveUserList({
                ShowUsers: false,
                Users: []
            }));
            var users = new InMemoryBrowserUsers_1.InMemoryBrowserUsers(window);
            users.getUsers().then(function (data) {
                var userList = data.map(function (v) {
                    return { Username: v.name };
                });
                dispatch(recieveUserList({ ShowUsers: true, Users: userList }));
            });
        };
        // return {type: ComfortActions.SET_USERLIST, userList: userList};
    }
    exports.fetchUserList = fetchUserList;
});
define("React/ComfortZone/Model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ComfortZoneRangeState = /** @class */ (function () {
        function ComfortZoneRangeState() {
        }
        return ComfortZoneRangeState;
    }());
    exports.ComfortZoneRangeState = ComfortZoneRangeState;
    var ComfortZoneState = /** @class */ (function () {
        function ComfortZoneState() {
        }
        return ComfortZoneState;
    }());
    exports.ComfortZoneState = ComfortZoneState;
});
define("React/Comfort/Model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ComfortUserChoiceState = /** @class */ (function () {
        function ComfortUserChoiceState() {
        }
        return ComfortUserChoiceState;
    }());
    exports.ComfortUserChoiceState = ComfortUserChoiceState;
    var ComfortZoneList = /** @class */ (function () {
        function ComfortZoneList() {
        }
        return ComfortZoneList;
    }());
    exports.ComfortZoneList = ComfortZoneList;
    var ComfortAppState = /** @class */ (function () {
        function ComfortAppState() {
        }
        return ComfortAppState;
    }());
    exports.ComfortAppState = ComfortAppState;
    var ComfortAppStateWithChildren = /** @class */ (function (_super) {
        __extends(ComfortAppStateWithChildren, _super);
        function ComfortAppStateWithChildren() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ComfortAppStateWithChildren;
    }(ComfortAppState));
    exports.ComfortAppStateWithChildren = ComfortAppStateWithChildren;
});
define("React/Comfort/Reducer", ["require", "exports", "React/Comfort/Actions", "../3rdParty/immutable.min", "React/Models/Point", "React/Models/Size", "React/Models/IDomMeasurement"], function (require, exports, Actions_2, immutable_min_2, Point_2, Size_2, IDomMeasurement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var initialSize = new Size_2.Size(800, 800);
    var initialState = {
        Size: initialSize,
        CenterPoint: new Point_2.Point(initialSize.width / 2, initialSize.height / 2),
        UserList: {
            ShowUsers: true,
            Users: [
                { Username: "Adam Hall", Focus: "not-in-focus", Y: 0 },
                { Username: "Caroline Hall", Focus: "not-in-focus", Y: 0 }
            ]
        },
        Zones: {
            Comfort: { Name: "Comfort", Focus: "not-in-focus", Range: { Start: 0, End: 33 }, Size: { Width: new IDomMeasurement_1.DOMMeasurement("50%"), Height: new IDomMeasurement_1.DOMMeasurement("50%") } },
            Stretch: { Name: "Stretch", Focus: "not-in-focus", Range: { Start: 34, End: 66 }, Size: { Width: new IDomMeasurement_1.DOMMeasurement("50%"), Height: new IDomMeasurement_1.DOMMeasurement("50%") } },
            Chaos: { Name: "Chaos", Focus: "not-in-focus", Range: { Start: 67, End: 100 }, Size: { Width: new IDomMeasurement_1.DOMMeasurement("100%"), Height: new IDomMeasurement_1.DOMMeasurement("100%") } }
        },
        ShowUserChoices: false,
        UserChoices: []
    };
    function comfortReducer(state, action) {
        if (state === void 0) { state = initialState; }
        switch (action.type) {
            case Actions_2.ComfortActions.SET_USERLIST:
                return ComfortZoneAction.setUsers(state, action.userList);
            case Actions_2.ComfortActions.SET_STAGEVISIBILITY:
                return ComfortZoneAction.setVisibility(state, action.visibility);
            case Actions_2.ComfortActions.SET_STAGESIZE:
                return ComfortZoneAction.setStageSize(state, action.width, action.height);
            case Actions_2.ComfortActions.SET_USERFOCUS:
                return ComfortZoneAction.setUserFocus(state, action.user, action.focus);
            case Actions_2.ComfortActions.SET_ZONEFOCUS:
                return ComfortZoneAction.setZoneFocus(state, action.area, action.focus);
            case Actions_2.ComfortActions.SELECT_USER:
                return ComfortZoneAction.selectUser(state, action.user);
            case Actions_2.ComfortActions.CHOOSE_ZONE:
                return ComfortZoneAction.chooseZone(state, action.user, action.area, action.distance);
            case Actions_2.ComfortActions.TOGGLE_CHOICES:
                return ComfortZoneAction.toggleChoiceVisibility(state, action.visible);
            default:
                return state;
        }
    }
    exports.comfortReducer = comfortReducer;
    var ComfortZoneAction = /** @class */ (function () {
        function ComfortZoneAction() {
        }
        ComfortZoneAction.setStageSize = function (state, width, height) {
            var newCenter = new Point_2.Point(width / 2, height / 2);
            return immutable_min_2.fromJS(state)
                .set("Size", new Size_2.Size(width, height))
                .set("CenterPoint", newCenter)
                .toJS();
        };
        ComfortZoneAction.setVisibility = function (state, visibility) {
            return immutable_min_2.fromJS(state)
                .setIn(["Zones", "Comfort", "visibility"], visibility)
                .setIn(["Zones", "Stretch", "visibility"], visibility)
                .setIn(["Zones", "Chaos", "visibility"], visibility).toJS();
            //  state.Zones.Chaos.visibility
        };
        ComfortZoneAction.setZoneFocus = function (state, area, focus) {
            return immutable_min_2.fromJS(state)
                .setIn(["Zones", "Comfort", "Focus"], area === "Comfort" ? focus : "not-in-focus")
                .setIn(["Zones", "Stretch", "Focus"], area === "Stretch" ? focus : "not-in-focus")
                .setIn(["Zones", "Chaos", "Focus"], area === "Chaos" ? focus : "not-in-focus").toJS();
        };
        ComfortZoneAction.setUserFocus = function (state, user, focus) {
            var originalList = immutable_min_2.List(state.UserList.Users);
            var newUserList = originalList.update(originalList.findIndex(function (item) { return item.Username === user; }), function (item) { return immutable_min_2.fromJS(item).set("Focus", focus); }).toJS();
            return immutable_min_2.fromJS(state)
                .setIn(["UserList", "Users"], newUserList).toJS();
        };
        ComfortZoneAction.selectUser = function (state, user) {
            var originalList = immutable_min_2.List(state.UserList.Users);
            var item = originalList.find(function (item) { return item.Username === user; });
            // Sets currentUser, and therefor hides the user choice menu
            var data = immutable_min_2.fromJS(state)
                .set("CurrentUser", item)
                .set("ShowUserChoices", false)
                .setIn(["UserList", "ShowUsers"], false);
            return data.toJS();
        };
        ComfortZoneAction.setUsers = function (state, userList) {
            console.log("Input", state.UserList);
            console.log("Update", userList);
            var data = immutable_min_2.fromJS(state)
                .set("UserList", userList).toJS();
            console.log("Output", data.UserList);
            return data;
        };
        ComfortZoneAction.chooseZone = function (state, user, area, distance) {
            // Add the user choice
            var newUserChoices = immutable_min_2.List(state.UserChoices).push({
                User: { Username: user },
                Zone: area,
                Distance: distance
            }).toJS();
            // Remove the user from the choice list
            var newUserList = immutable_min_2.List(state.UserList.Users).filter(function (item) { return item.Username !== user; }).toArray();
            // Show the user list
            var showUserChoice = !!(newUserList.length);
            // Return
            return immutable_min_2.fromJS(state)
                .delete("CurrentUser")
                .set("ShowUserChoices", showUserChoice)
                .set("UserChoices", newUserChoices)
                .setIn(["UserList", "Users"], newUserList)
                .setIn(["UserList", "ShowUsers"], showUserChoice).toJS();
        };
        ComfortZoneAction.toggleChoiceVisibility = function (state, visible) {
            // Set "showUserChoices" to true
            return immutable_min_2.Map(state)
                .set("ShowUserChoices", visible).toJS();
        };
        return ComfortZoneAction;
    }());
});
define("React/CombineReducers", ["require", "exports", "redux", "React/Tuckman/Reducer", "React/Comfort/Reducer"], function (require, exports, redux_1, Reducer_1, Reducer_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = redux_1.combineReducers({
        tuckmanReducer: Reducer_1.tuckmanReducer,
        comfortReducer: Reducer_2.comfortReducer
    });
});
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="../typings/main/definitions/immutable/index.d.ts" />
/// <reference path="../typings/redux/redux.d.ts" />
requirejs.config({
    baseUrl: "/",
    paths: {
        "react": "../3rdParty/react.min",
        "react-dom": "../3rdParty/react-dom.min",
        "immutable": "../3rdParty/immutable.min",
        "immutability-helper": "../3rdParty/index",
        "redux": "../3rdParty/redux.min",
        "react-redux": "../3rdParty/react-redux.min",
    }
});
// require(["React/Store"], (store) => {
require(["React/Comfort/Store", "React/Tuckman/Store"], function (comfortStore, tuckmanStore) {
    // require(["React/Comfort/Store"], (comfortStore) => {
    // require(["React/Tuckman/Store"], (tuckmanStore) => {
    // comfort.resizeImage();
    // tuckman.resizeImage();
    (function setupFormViewability() {
        var showForm = function (formName) {
            window.history.pushState({}, urlParam, "/react/react.html?model=" + formName);
            switch (formName) {
                case ModelEnum.All:
                    // document.getElementById("tuckman").className = "hidden";
                    // document.getElementById("comfort").className = "hidden";
                    console.log("GO", tuckmanStore.getStore().getState());
                    // comfortStore.hideModel();
                    comfortStore.myComfortStore.dispatch({ type: "SET_STAGEVISIBLE", visibility: "appearing" });
                    tuckmanStore.myTuckmanStore.dispatch({ type: "SET_STAGEVISIBLE", visibility: "appearing" });
                    break;
                case ModelEnum.ComfortZone:
                    // comfortStore.resizeImage();
                    tuckmanStore.myTuckmanStore.dispatch({ type: "SET_STAGEVISIBLE", visibility: "hiding" });
                    comfortStore.myComfortStore.dispatch({ type: "SET_STAGEVISIBLE", visibility: "appearing" });
                    break;
                case ModelEnum.Tuckman:
                    // document.getElementById("tuckman").className = "";
                    // document.getElementById("comfort").className = "hidden";
                    comfortStore.myComfortStore.dispatch({ type: "SET_STAGEVISIBLE", visibility: "hiding" });
                    tuckmanStore.myTuckmanStore.dispatch({ type: "SET_STAGEVISIBLE", visibility: "appearing" });
                    // comfortStore.hideModel();
                    break;
            }
        };
        var ModelEnum = {
            All: "",
            Tuckman: "Tuckman",
            ComfortZone: "ComfortZone"
        };
        var getModelFromQuerystring = function () {
            var urlParams = document.URL.split("?model=");
            if (urlParams && urlParams.length >= 1) {
                return urlParams[1];
            }
            return ModelEnum.All;
        };
        var urlParam = getModelFromQuerystring();
        showForm(urlParam);
        document.getElementById("tuckman").onclick = function () {
            showForm(ModelEnum.Tuckman);
        };
        document.getElementById("comfort").onclick = function () {
            showForm(ModelEnum.ComfortZone);
        };
    })();
});
define("React/Shared/WindowHelper", ["require", "exports", "React/Models/Size"], function (require, exports, Size_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getWidthHeight() {
        var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0], x = w.innerWidth || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;
        return new Size_3.Size(x, y);
    }
    exports.getWidthHeight = getWidthHeight;
});
define("React/Stage/Component", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Stage = function (state) {
        return React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", id: "stage", width: state.Size.width, height: state.Size.height }, state.InnerBits);
    };
});
define("React/Animation/Component", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BouncyAnimation = /** @class */ (function (_super) {
        __extends(BouncyAnimation, _super);
        function BouncyAnimation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BouncyAnimation.prototype.render = function () {
            var delay = this.props.delay || "0s";
            var duration = this.props.duration || "0.8s";
            var toValue = parseInt(this.props.value || (20), 10);
            var toValueType = this.props.valueType || "%";
            var values = [
                0 + toValueType,
                (toValue + toValue / 4) + toValueType,
                (toValue - toValue / 10) + toValueType,
                (toValue + toValue / 20) + toValueType,
                (toValue) + toValueType,
            ];
            var valuesToString = values.join(";");
            return React.createElement("animate", { attributeType: "XML", attributeName: this.props.attributeName, from: "0%", to: "20%", dur: duration, begin: delay, values: valuesToString, keyTimes: "0; 0.3; 0.6; 0.8; 1", fill: "freeze" });
        };
        return BouncyAnimation;
    }(React.Component));
    exports.BouncyAnimation = BouncyAnimation;
});
define("React/Stage/Connector", ["require", "exports", "react-redux", "React/Stage/Component"], function (require, exports, react_redux_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StageConnector = react_redux_1.connect(function (state, props) {
        return { Size: state.Size, InnerBits: props.children };
    })(Component_1.Stage);
});
define("React/User/Component", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReduxUserList = function (state) {
        var className = state.ShowUsers ? "appear" : "disappear";
        return React.createElement("g", { id: "users", className: className }, state.Users.map(function (user, i) {
            return React.createElement(exports.ReduxUser, __assign({ key: user.Username }, user, { events: state.events }));
        }));
    };
    exports.ReduxUser = function (state) {
        // 60 , 150, 240
        var textY = state.Y + 60;
        return React.createElement("g", { className: "user-group" },
            React.createElement("rect", { className: state.Focus, onMouseEnter: function () { return state.events.onUserOverFocus(state.Username); }, onMouseLeave: function () { return state.events.onUserOffFocus(state.Username); }, onMouseDown: function () { return state.events.onUserMouseDown(state.Username); }, onMouseUp: function (event) { return state.events.onUserMouseUp(state.Username, event); }, y: state.Y, x: "0", width: "800", height: "90" }),
            React.createElement("text", { className: "username", y: textY, x: "60" }, state.Username));
    };
});
define("React/User/Connector", ["require", "exports", "react-redux", "React/Comfort/Actions", "React/User/Component", "../3rdParty/immutable.min"], function (require, exports, react_redux_2, Actions_3, Component_2, immutable_min_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mapStateToProps = function (state, ownProps) {
        return {
            ShowUsers: state.UserList.ShowUsers,
            Users: state.UserList.Users.map(function (u, i) {
                return immutable_min_3.fromJS(u).set("Y", (i * 90) + 60).toJS();
            })
        };
    };
    var mapDispatchToProps = function (dispatch) {
        return {
            events: {
                onUserMouseDown: function (user) {
                    dispatch(Actions_3.setUserFocus(user, "active"));
                },
                onUserMouseUp: function (user, event) {
                    dispatch(Actions_3.setUserFocus(user, "not-in-focus"));
                    dispatch(Actions_3.selectUser(user));
                },
                onUserOverFocus: function (user) {
                    dispatch(Actions_3.setUserFocus(user, "in-focus"));
                },
                onUserOffFocus: function (user) {
                    dispatch(Actions_3.setUserFocus(user, "not-in-focus"));
                }
            }
        };
    };
    exports.ReduxUserConnector = react_redux_2.connect(mapStateToProps, mapDispatchToProps)(Component_2.ReduxUserList);
});
// UserListConnector
define("React/TuckmanZone/Component", ["require", "exports", "react", "React/Animation/Component"], function (require, exports, React, Component_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TuckmanZone = function (state) {
        var index = state.index || 0;
        var textID = state.label + "-label";
        var textOffset = 12 + (25 * state.index) + "%";
        var delay = (0.2 * state.index) + "s";
        var className = state.focus + " area okay js-area-standard";
        var offset = (25 * state.index) + "%";
        var initialX = "0%";
        if (state.visibility === "hiding") {
            initialX = offset;
            offset = "100%";
        }
        /*return <g>
            <rect className={className} id={state.label}
                onMouseUp={state.events.onMouseUp}
                onMouseDown={state.events.onMouseDown}
                onMouseEnter={state.events.onMouseEnter}
                onMouseLeave={state.events.onMouseLeave}
                x="0" y="0" width="25%" height="100%">
                <BouncyAnimation attributeName="x"  value={offset} delay={delay} />
            </rect>
            <text className="area-label" id={textID} textAnchor="middle" text-anchor="middle" x={textOffset} y="50%">{state.label}</text>;
        </g>;*/
        return React.createElement("g", null,
            React.createElement("rect", { className: className, id: state.label, onMouseEnter: function () { return state.Events.onZoneOverFocus(state.label); }, onMouseLeave: function () { return state.Events.onZoneOffFocus(state.label); }, onMouseDown: function () { return state.Events.onZoneMouseDown(state.label); }, onMouseUp: function (event) { return state.Events.onZoneMouseUp(state.username, state.label, state.maxWidth, event); }, x: initialX, y: "0", width: "25%", height: "100%" },
                React.createElement(Component_3.BouncyAnimation, { attributeName: "x", value: offset, delay: delay })),
            React.createElement("text", { className: "area-label", id: textID, textAnchor: "middle", "text-anchor": "middle", x: textOffset, y: "50%" }, state.label),
            ";");
    };
});
define("React/TuckmanZone/Connector", ["require", "exports", "react-redux", "React/TuckmanZone/Component", "React/Tuckman/Actions", "React/Models/Point"], function (require, exports, react_redux_3, Component_4, Actions_4, Point_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mapStateToProps = function (state, props) {
        var myState = state.zones[props.label];
        myState.maxWidth = state.Size.width;
        myState.username = state.CurrentUser ? state.CurrentUser.Username : "";
        return myState;
    };
    var mapDispatchToProps = function (dispatch) {
        return {
            Events: {
                onZoneMouseDown: function (zone) {
                    dispatch(Actions_4.setZoneFocus(zone, "active"));
                },
                onZoneMouseUp: function (user, zone, maxDistance, event) {
                    dispatch(Actions_4.setZoneFocus(zone, "not-in-focus"));
                    var distance = event.clientX;
                    var distanceAsPercentage = Point_3.Point.distanceAsPercentage(distance, maxDistance);
                    dispatch(Actions_4.chooseZone(user, zone, distanceAsPercentage)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
                },
                onZoneOverFocus: function (zone) {
                    dispatch(Actions_4.setZoneFocus(zone, "in-focus"));
                },
                onZoneOffFocus: function (zone) {
                    dispatch(Actions_4.setZoneFocus(zone, "not-in-focus"));
                }
            }
        };
    };
    exports.TuckmanZoneConnector = react_redux_3.connect(mapStateToProps, mapDispatchToProps)(Component_4.TuckmanZone);
});
define("React/TuckmanUserChoice/Model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("React/TuckmanUserChoice/Component", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TuckmanUserHistoryArea = function (state) {
        if (state && state.Choices.length) {
            var totalPoints_1 = state.Choices.length;
            var maxWidth_1 = state.MaxWidth;
            return React.createElement("g", { id: "history" }, state.Choices.map(function (userChoice, i) {
                return React.createElement(exports.TuckmanUserHistory, { key: userChoice.User.Username, Index: i, MaxWidth: maxWidth_1, MaxHeight: state.MaxHeight, Distance: userChoice.Distance, TotalCount: totalPoints_1 });
            }));
        }
        else {
            return React.createElement("g", { id: "history" });
        }
    };
    exports.TuckmanUserHistory = function (state) {
        var x = ((state.MaxWidth / 100) * state.Distance);
        var y = (state.MaxHeight / state.TotalCount) * state.Index;
        return React.createElement("circle", { cx: x, cy: y, r: "10", className: "point" });
    };
});
define("React/TuckmanUserChoice/Connector", ["require", "exports", "react-redux", "React/TuckmanUserChoice/Component"], function (require, exports, react_redux_4, Component_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mapStateToProps = function (state) {
        return {
            Choices: state.UserChoices,
            MaxWidth: state.Size.width,
            MaxHeight: state.Size.height
        };
    };
    exports.TuckmanUserHistoryConnector = react_redux_4.connect(mapStateToProps)(Component_5.TuckmanUserHistoryArea);
});
// UserListConnector
define("React/Tuckman/Component", ["require", "exports", "react", "React/User/Connector", "React/TuckmanZone/Connector", "React/TuckmanUserChoice/Connector"], function (require, exports, React, Connector_1, Connector_2, Connector_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TuckmanStage = function (state) {
        // const mod : ITuckmanModel = state;
        var perf = state.zones.performing;
        return React.createElement("g", null,
            React.createElement("g", { id: "zones" },
                React.createElement(Connector_2.TuckmanZoneConnector, { label: "performing" }),
                React.createElement(Connector_2.TuckmanZoneConnector, { label: "norming" }),
                React.createElement(Connector_2.TuckmanZoneConnector, { label: "storming" }),
                React.createElement(Connector_2.TuckmanZoneConnector, { label: "forming" })),
            React.createElement(Connector_1.ReduxUserConnector, null),
            React.createElement(Connector_3.TuckmanUserHistoryConnector, null),
            React.createElement("button", { id: "show-tuckman", onMouseUp: state.onShow }, "show tuckman"),
            React.createElement("button", { id: "hide-tuckman", onMouseUp: state.onHide }, "hide tuckman"));
    };
});
define("React/ComfortZone/Component", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReduxChaosArea = function (state) {
        var username = state.User && state.User.Username ? state.User.Username : "Adam Hall";
        return React.createElement("g", null,
            React.createElement("rect", { id: "chaos", className: state.Zone.Focus, onMouseEnter: function () { return state.Events.onZoneOverFocus(state.Zone.Name); }, onMouseLeave: function () { return state.Events.onZoneOffFocus(state.Zone.Name); }, onMouseDown: function () { return state.Events.onZoneMouseDown(state.Zone.Name); }, onMouseUp: function (event) { return state.Events.onZoneMouseUp(username, state.Zone.Name, state.CenterPoint, state.TotalDistance, event); }, width: state.Zone.Size.Width.toString(), height: state.Zone.Size.Height.toString() }),
            React.createElement("text", { className: "area-label", id: "label-chaos", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "20" }, "chaos"));
    };
    exports.ReduxStretchArea = function (state) {
        var username = state.User && state.User.Username ? state.User.Username : "Adam Hall";
        return React.createElement("g", null,
            React.createElement("circle", { className: state.Zone.Focus, id: "stretch", r: "33%", cx: "50%", cy: "50%", onMouseEnter: function () { return state.Events.onZoneOverFocus(state.Zone.Name); }, onMouseLeave: function () { return state.Events.onZoneOffFocus(state.Zone.Name); }, onMouseDown: function () { return state.Events.onZoneMouseDown(state.Zone.Name); }, onMouseUp: function (event) { return state.Events.onZoneMouseUp(username, state.Zone.Name, state.CenterPoint, state.TotalDistance, event); }, width: state.Zone.Size.Width.toString(), height: state.Zone.Size.Height.toString() }),
            React.createElement("text", { className: "area-label", id: "label-stretch", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "20%" }, "stretch"));
    };
    exports.ReduxComfortArea = function (state) {
        var username = state.User && state.User.Username ? state.User.Username : "Adam Hall";
        return React.createElement("g", null,
            React.createElement("circle", { className: state.Zone.Focus, id: "stretch", r: "15%", cx: "50%", cy: "50%", onMouseEnter: function () { return state.Events.onZoneOverFocus(state.Zone.Name); }, onMouseLeave: function () { return state.Events.onZoneOffFocus(state.Zone.Name); }, onMouseDown: function () { return state.Events.onZoneMouseDown(state.Zone.Name); }, onMouseUp: function (event) { return state.Events.onZoneMouseUp(username, state.Zone.Name, state.CenterPoint, state.TotalDistance, event); }, width: state.Zone.Size.Width.toString(), height: state.Zone.Size.Height.toString() }),
            React.createElement("text", { className: "area-label", id: "label-stretch", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "50%" }, "comfort"));
    };
});
define("React/ComfortZone/Connector", ["require", "exports", "react-redux", "React/Comfort/Actions", "React/ComfortZone/Component", "React/Models/Point"], function (require, exports, react_redux_5, Actions_5, Component_6, Point_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mapStateToProps = function (state, ownProps) {
        var maxDistance = state.Size.shortest();
        if (ownProps.Name === "Comfort") {
            return { Zone: state.Zones.Comfort, User: state.CurrentUser, CenterPoint: state.CenterPoint, TotalDistance: maxDistance };
        }
        else if (ownProps.Name === "Chaos") {
            return { Zone: state.Zones.Chaos, User: state.CurrentUser, CenterPoint: state.CenterPoint, TotalDistance: maxDistance };
        }
        else {
            return { Zone: state.Zones.Stretch, User: state.CurrentUser, CenterPoint: state.CenterPoint, TotalDistance: maxDistance };
        }
    };
    var getCenterPointFromElement = function (el) {
        var boundingBox = el.getBBox();
        var centerX = (boundingBox.width - boundingBox.x) / 2;
        var centerY = (boundingBox.height - boundingBox.y) / 2;
        return new Point_4.Point(centerX, centerY);
    };
    var mapDispatchToProps = function (dispatch) {
        return {
            Events: {
                onZoneMouseDown: function (zone) {
                    dispatch(Actions_5.setZoneFocus(zone, "active"));
                },
                onZoneMouseUp: function (user, zone, centerPoint, maxDistance, event) {
                    dispatch(Actions_5.setZoneFocus(zone, "not-in-focus"));
                    var coord = [event.clientX, event.clientY];
                    // const centerPoint = getCenterPointFromElement(event.currentTarget);
                    var distance = Point_4.Point.distance(centerPoint, Point_4.Point.fromCoords(coord));
                    var distanceAsPercentage = Point_4.Point.distanceAsPercentage(distance, maxDistance);
                    dispatch(Actions_5.chooseZone(user, zone, distanceAsPercentage)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
                },
                onZoneOverFocus: function (zone) {
                    dispatch(Actions_5.setZoneFocus(zone, "in-focus"));
                },
                onZoneOffFocus: function (zone) {
                    dispatch(Actions_5.setZoneFocus(zone, "not-in-focus"));
                }
            }
        };
    };
    exports.ReduxChaosConnector = react_redux_5.connect(mapStateToProps, mapDispatchToProps)(Component_6.ReduxChaosArea);
    exports.ReduxStretchConnector = react_redux_5.connect(mapStateToProps, mapDispatchToProps)(Component_6.ReduxStretchArea);
    exports.ReduxComfortConnector = react_redux_5.connect(mapStateToProps, mapDispatchToProps)(Component_6.ReduxComfortArea);
});
define("React/ComfortUserChoice/Model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("React/ComfortUserChoice/Component", ["require", "exports", "react", "React/Models/Point", "React/Models/Polar"], function (require, exports, React, Point_5, Polar_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReduxUserHistoryArea = function (state) {
        if (state && state.Choices.length) {
            var totalPoints = state.Choices.length;
            var radian = 6.2831853072; // 360 * Math.PI / 180;
            var polarDivision_1 = radian / totalPoints;
            var maxDistance_1 = state.MaxDistance;
            return React.createElement("g", { id: "history" }, state.Choices.map(function (userChoice, i) {
                return React.createElement(exports.ReduxUserHistory, __assign({ CenterPoint: state.CenterPoint, key: userChoice.User.Username }, userChoice, { Index: i, PolarDivision: polarDivision_1, MaxDistance: maxDistance_1 }));
            }));
        }
        else {
            return React.createElement("g", { id: "history" });
        }
    };
    exports.ReduxUserHistory = function (state) {
        var angle = state.PolarDivision * state.Index;
        var distanceAsPixels = ((state.Distance / 100) * state.MaxDistance);
        var point = Point_5.Point.toCartesian(new Polar_2.Polar(distanceAsPixels, angle), state.CenterPoint);
        return React.createElement("circle", { cx: point.x, cy: point.y, r: "10", className: "point" });
    };
});
define("React/ComfortUserChoice/Connector", ["require", "exports", "react-redux", "React/ComfortUserChoice/Component"], function (require, exports, react_redux_6, Component_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mapStateToProps = function (state) {
        return {
            Choices: state.UserChoices,
            CenterPoint: state.CenterPoint,
            MaxDistance: state.Size.shortest()
        };
    };
    exports.ReduxUserHistoryConnector = react_redux_6.connect(mapStateToProps)(Component_7.ReduxUserHistoryArea);
});
// UserListConnector
define("React/Comfort/Component", ["require", "exports", "react", "React/ComfortZone/Connector", "React/User/Connector", "React/ComfortUserChoice/Connector"], function (require, exports, React, Connector_4, Connector_5, Connector_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComfortStage = function (state) { return (React.createElement("g", null,
        React.createElement("g", null,
            React.createElement(Connector_4.ReduxChaosConnector, { Name: "Chaos" }),
            React.createElement(Connector_4.ReduxStretchConnector, { Name: "Stretch" }),
            React.createElement(Connector_4.ReduxComfortConnector, { Name: "Comfort" }),
            React.createElement(Connector_5.ReduxUserConnector, null),
            React.createElement(Connector_6.ReduxUserHistoryConnector, null)),
        ",",
        React.createElement("button", { id: "show-tuckman", onMouseUp: state.onShow }, "show tuckman"),
        ",",
        React.createElement("button", { id: "hide-tuckman", onMouseUp: state.onHide }, "hide tuckman"))); };
});
define("React/Store", ["require", "exports", "react", "redux", "react-dom", "react-redux", "React/Tuckman/Actions", "React/CombineReducers", "React/Shared/WindowHelper", "React/Comfort/Component", "React/Stage/Connector", "Shared/InMemoryBrowserUsers"], function (require, exports, React, redux_2, react_dom_1, react_redux_7, Actions_6, CombineReducers_1, WindowHelper_1, Component_8, Connector_7, InMemoryBrowserUsers_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var myStore = redux_2.createStore(CombineReducers_1.default);
    var initSize = WindowHelper_1.getWidthHeight();
    myStore.dispatch(Actions_6.setStageSize(initSize.height, initSize.height));
    var users = new InMemoryBrowserUsers_2.InMemoryBrowserUsers(window);
    var unsubscribe = myStore.subscribe(function () {
        return console.log(myStore.getState());
    });
    react_dom_1.render(React.createElement(react_redux_7.Provider, { store: myStore },
        React.createElement(Connector_7.StageConnector, null,
            React.createElement(Component_8.ComfortStage, null))), document.getElementById("container"));
    // <TuckmanStage />
    // <TuckmanConnector />
    // <div id="comfort"></div>
    // <div id="tuckman"></div>
    function resizeImage() {
        var size = WindowHelper_1.getWidthHeight();
        if (size.width > size.height) {
            myStore.dispatch(Actions_6.setStageSize(size.height, size.height));
        }
        else {
            myStore.dispatch(Actions_6.setStageSize(size.width, size.width));
        }
    }
    exports.resizeImage = resizeImage;
    window.addEventListener("resize", resizeImage, false);
});
// Stop listening to state updates
// unsubscribe(); ;
define("React/Comfort/Connector", ["require", "exports", "react-redux", "React/Comfort/Component", "React/Comfort/Actions"], function (require, exports, react_redux_8, Component_9, Actions_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mapStateToProps = function (state) {
        return state;
    };
    var mapDispatchToProps = function (dispatch) {
        return {
            Events: {
                onHide: function () {
                    dispatch(Actions_7.setStageVisibility("hiding"));
                },
                onShow: function () {
                    dispatch(Actions_7.setStageVisibility("appearing"));
                }
            }
        };
    };
    exports.ComfortConnector = react_redux_8.connect(mapStateToProps, mapDispatchToProps)(Component_9.ComfortStage);
});
define("React/Comfort/Store", ["require", "exports", "react", "redux", "React/Comfort/Connector", "React/Comfort/Reducer", "react-dom", "react-redux", "React/Comfort/Actions", "React/Shared/WindowHelper", "React/Stage/Connector"], function (require, exports, React, redux_3, Connector_8, Reducer_3, react_dom_2, react_redux_9, Actions_8, WindowHelper_2, Connector_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.myComfortStore = redux_3.createStore(Reducer_3.comfortReducer);
    // comfortStore.dispatch(fetchUserList());
    exports.myComfortStore.dispatch(Actions_8.setStageSize(800, 800));
    var unsubscribe = exports.myComfortStore.subscribe(function () {
        return console.log(exports.myComfortStore.getState());
    });
    react_dom_2.render(React.createElement(react_redux_9.Provider, { store: exports.myComfortStore },
        React.createElement(Connector_9.StageConnector, null,
            React.createElement(Connector_8.ComfortConnector, null))), document.getElementById("comfort"));
    function resizeImage() {
        var size = WindowHelper_2.getWidthHeight();
        if (size.width > size.height) {
            exports.myComfortStore.dispatch(Actions_8.setStageSize(size.height, size.height));
        }
        else {
            exports.myComfortStore.dispatch(Actions_8.setStageSize(size.width, size.width));
        }
        exports.myComfortStore.dispatch(Actions_8.setStageSize(size.height, size.height));
    }
    exports.resizeImage = resizeImage;
    function getStore() {
        return exports.myComfortStore;
    }
    exports.getStore = getStore;
    function hideModel() {
        exports.myComfortStore.dispatch(Actions_8.setStageVisibility("hiding"));
    }
    function showModel() {
        exports.myComfortStore.dispatch(Actions_8.setStageVisibility("appearing"));
    }
    window.addEventListener("resize", resizeImage, false);
});
// Stop listening to state updates
// unsubscribe(); ;
define("React/Shared/SVGEvents", ["require", "exports", "React/Models/Point"], function (require, exports, Point_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SVGEvents = /** @class */ (function () {
        function SVGEvents() {
        }
        SVGEvents.getDistance = function (x, y, target) {
            return Point_6.Point.distance(new Point_6.Point(x, y), SVGEvents.getCenter(target));
        };
        SVGEvents.getCenter = function (target) {
            var rect = target.getBoundingClientRect();
            return new Point_6.Point(rect.left + (rect.width / 2), rect.top + (rect.height / 2));
        };
        return SVGEvents;
    }());
    exports.SVGEvents = SVGEvents;
});
define("React/Shared/Events", ["require", "exports", "React/Shared/SVGEvents"], function (require, exports, SVGEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Events = /** @class */ (function () {
        function Events() {
        }
        Events.calculateDistance = function (distance) {
            if (distance < 34) {
                return "comfort";
            }
            else if (distance < 67) {
                return "stretch";
            }
            else {
                return "chaos";
            }
        };
        Events.mouseEnter = function () {
            this.setState({ focus: "in-focus" });
        };
        Events.mouseDown = function () {
            this.setState({ focus: "active" });
        };
        Events.mouseUp = function (a) {
            var target = a.target;
            var center = SVGEvents_1.SVGEvents.getCenter(target);
            var distance = SVGEvents_1.SVGEvents.getDistance(a.clientX, a.clientY, target);
            this.setState({ focus: "not-in-focus" });
        };
        Events.mouseLeave = function () {
            this.setState({ focus: "not-in-focus" });
        };
        return Events;
    }());
    exports.Events = Events;
});
define("React/Tuckman/Connector", ["require", "exports", "react-redux", "React/Tuckman/Component", "React/Tuckman/Actions"], function (require, exports, react_redux_10, Component_10, Actions_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mapStateToProps = function (state) {
        return state;
    };
    var mapDispatchToProps = function (dispatch) {
        return {
            Events: {
                onHide: function () {
                    dispatch(Actions_9.setStageVisibility("hiding"));
                },
                onShow: function () {
                    dispatch(Actions_9.setStageVisibility("appearing"));
                }
            }
        };
    };
    exports.TuckmanConnector = react_redux_10.connect(mapStateToProps, mapDispatchToProps)(Component_10.TuckmanStage);
});
define("React/Tuckman/Store", ["require", "exports", "react", "redux", "react-dom", "react-redux", "React/Tuckman/Actions", "React/Shared/WindowHelper", "React/Tuckman/Connector", "React/Stage/Connector", "React/Tuckman/Reducer", "Shared/InMemoryBrowserUsers"], function (require, exports, React, Redux, react_dom_3, react_redux_11, Actions_10, WindowHelper_3, Connector_10, Connector_11, Reducer_4, InMemoryBrowserUsers_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.myTuckmanStore = Redux.createStore(Reducer_4.tuckmanReducer);
    var users = new InMemoryBrowserUsers_3.InMemoryBrowserUsers(window);
    var unsubscribe = exports.myTuckmanStore.subscribe(function () {
        return console.log(exports.myTuckmanStore.getState());
    });
    react_dom_3.render(React.createElement(react_redux_11.Provider, { store: exports.myTuckmanStore },
        React.createElement(Connector_11.StageConnector, null,
            React.createElement(Connector_10.TuckmanConnector, null))), document.getElementById("tuckman"));
    function resizeImage() {
        var size = WindowHelper_3.getWidthHeight();
        if (size.width > size.height) {
            exports.myTuckmanStore.dispatch(Actions_10.setStageSize(size.height, size.height));
        }
        else {
            exports.myTuckmanStore.dispatch(Actions_10.setStageSize(size.width, size.width));
        }
    }
    exports.resizeImage = resizeImage;
    function getStore() {
        return exports.myTuckmanStore;
    }
    exports.getStore = getStore;
    function hideModel() {
        exports.myTuckmanStore.dispatch(Actions_10.setStageVisibility("hiding"));
    }
    function showModel() {
        exports.myTuckmanStore.dispatch(Actions_10.setStageVisibility("appearing"));
    }
    window.addEventListener("resize", resizeImage, false);
    setTimeout(function () {
        console.log("HIDE IT!");
        exports.myTuckmanStore.dispatch(Actions_10.setStageVisibility("hiding"));
    }, 5000);
});
// Stop listening to state updates
// unsubscribe(); ;
define("React/__tests__/ComfortTests", ["require", "exports", "react", "../../3rdParty/redux.min", "React/Comfort/Component", "React/Comfort/Reducer", "../../3rdParty/react-redux.min", "React/Comfort/Actions", "React/Stage/Connector"], function (require, exports, React, redux_min_1, Component_11, Reducer_5, react_redux_min_1, Action, Connector_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var renderizer = require("react-test-renderer");
    test("Should not mutate in any way", function () {
        var myState = Reducer_5.comfortReducer(undefined, { type: "Startup" });
        var initialState = JSON.stringify(myState);
        var checkAfterAction = function (action) {
            var currentState = Reducer_5.comfortReducer(myState, action);
            expect(initialState).toEqual(JSON.stringify(myState));
        };
        checkAfterAction(Action.setUserFocus("Adam Hall", "in-focus"));
        checkAfterAction(Action.selectUser("Adam Hall"));
        checkAfterAction(Action.setStageSize(800, 600));
        checkAfterAction(Action.setZoneFocus("Chaos", "in-focus"));
        checkAfterAction(Action.setZoneFocus("Stretch", "active"));
        checkAfterAction(Action.setZoneFocus("Comfort", "in-focus"));
        checkAfterAction(Action.toggleChoiceVisibility(true));
        checkAfterAction(Action.toggleChoiceVisibility(false));
        checkAfterAction(Action.chooseZone("Adam Hall", "Stretch", 85));
    });
    test("Should show the component", function () {
        // Arrange
        var myStore = redux_min_1.createStore(Reducer_5.comfortReducer);
        var component = renderizer.create(React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", id: "stage" },
            React.createElement(react_redux_min_1.Provider, { store: myStore },
                React.createElement(Connector_12.StageConnector, null,
                    React.createElement(Component_11.ComfortStage, null)))));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Action.setUserFocus("Adam Hall", "in-focus"));
        expect(component.toJSON()).toMatchSnapshot();
    });
    test("Should allow shrinking", function () {
        // Arrange
        var myStore = redux_min_1.createStore(Reducer_5.comfortReducer);
        var component = renderizer.create(React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", id: "stage" },
            React.createElement(react_redux_min_1.Provider, { store: myStore },
                React.createElement(Connector_12.StageConnector, null,
                    React.createElement(Component_11.ComfortStage, null)))));
        myStore.dispatch(Action.chooseZone("Adam Hall", "Stretch", 50));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Action.chooseZone("Caroline Hall", "Chaos", 100));
        expect(component.toJSON()).toMatchSnapshot();
    });
    test("Should allow hiding", function () {
        // Arrange
        var myStore = redux_min_1.createStore(Reducer_5.comfortReducer);
        var component = renderizer.create(React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", id: "stage" },
            React.createElement(react_redux_min_1.Provider, { store: myStore },
                React.createElement(Connector_12.StageConnector, null,
                    React.createElement(Component_11.ComfortStage, null)))));
        myStore.dispatch(Action.setStageVisibility("hiding"));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Action.setStageVisibility("appearing"));
        expect(component.toJSON()).toMatchSnapshot();
    });
    test("Should allow users to be set okay", function () {
        // Arrange
        var myStore = redux_min_1.createStore(Reducer_5.comfortReducer);
        var component = renderizer.create(React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", id: "stage" },
            React.createElement(react_redux_min_1.Provider, { store: myStore },
                React.createElement(Connector_12.StageConnector, null,
                    React.createElement(Component_11.ComfortStage, null)))));
        var users = {
            Users: [
                { Username: "Test person 1" },
                { Username: "Test person 2" },
                { Username: "Test person 3" }
            ]
        };
        myStore.dispatch(Action.recieveUserList(users));
        expect(component.toJSON()).toMatchSnapshot();
    });
});
define("React/__tests__/TuckmanTests", ["require", "exports", "react", "../../3rdParty/redux.min", "../../3rdParty/react-redux.min", "React/Tuckman/Reducer", "React/Tuckman/Actions", "React/Tuckman/Connector", "React/Stage/Connector"], function (require, exports, React, redux_min_2, react_redux_min_2, Reducer_6, Action, Connector_13, Connector_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var renderizer = require("react-test-renderer");
    test("Should not mutate in any way", function () {
        var myStore = redux_min_2.createStore(Reducer_6.tuckmanReducer);
        var originalState = myStore.getState();
        var inputState = JSON.stringify(originalState);
        var checkAfterAction = function (action) {
            myStore.dispatch(action);
            expect(inputState).toEqual(JSON.stringify(originalState));
        };
        checkAfterAction(Action.setUserFocus("Adam Hall", "in-focus"));
        checkAfterAction(Action.selectUser("Adam Hall"));
        checkAfterAction(Action.setStageSize(800, 600));
        checkAfterAction(Action.setZoneFocus("forming", "in-focus"));
        checkAfterAction(Action.setZoneFocus("storming", "active"));
        checkAfterAction(Action.setZoneFocus("norming", "in-focus"));
        checkAfterAction(Action.setZoneFocus("performing", "in-focus"));
        checkAfterAction(Action.toggleChoiceVisibility(true));
        checkAfterAction(Action.toggleChoiceVisibility(false));
        checkAfterAction(Action.chooseZone("Adam Hall", "performing", 85));
    });
    test("Focusable zones", function () {
        var myStore = redux_min_2.createStore(Reducer_6.tuckmanReducer);
        myStore.dispatch(Action.setStageSize(800, 600));
        var component = renderizer.create(React.createElement(react_redux_min_2.Provider, { store: myStore },
            React.createElement(Connector_14.StageConnector, null,
                React.createElement(Connector_13.TuckmanConnector, null))));
        myStore.dispatch(Action.setZoneFocus("forming", "in-focus"));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Action.setZoneFocus("forming", "not-in-focus"));
        myStore.dispatch(Action.setZoneFocus("storming", "in-focus"));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Action.setZoneFocus("storming", "not-in-focus"));
        myStore.dispatch(Action.setZoneFocus("norming", "in-focus"));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Action.setZoneFocus("norming", "not-in-focus"));
        myStore.dispatch(Action.setZoneFocus("performing", "in-focus"));
        expect(component.toJSON()).toMatchSnapshot();
    });
    test("Should show the component", function () {
        // Arrange
        var myStore = redux_min_2.createStore(Reducer_6.tuckmanReducer);
        myStore.dispatch(Action.setStageSize(800, 600));
        var component = renderizer.create(React.createElement(react_redux_min_2.Provider, { store: myStore },
            React.createElement(Connector_14.StageConnector, null,
                React.createElement(Connector_13.TuckmanConnector, null))));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Action.setZoneFocus("forming", "in-focus"));
        expect(component.toJSON()).toMatchSnapshot();
    });
});
/*
it("Should show the stretch area", () => {
    // Arrange
    const component = renderizer.create(
        <Stage><ChartArea width="200" offset="100" label="example"></ChartArea></Stage>
    );
    expect(component.toJSON()).toMatchSnapshot();

});


*/

//# sourceMappingURL=compiled.js.map
