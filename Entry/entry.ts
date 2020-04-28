/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="../Shared/InMemoryBrowserUsers.ts"/>
/// <reference path="../Shared/UserConstructor.ts"/>
requirejs.config( {
    baseUrl : "/"
});

let users;

require(["Shared/InMemoryBrowserUsers", "Shared/UserConstructor"], (u, c) => {
    users = new u.InMemoryBrowserUsers(window);

    class UIEntry {
        constructor() {
            document.getElementById("new").addEventListener("mousedown", () => {
                UI.ClearUsers();
            });
            document.getElementById("user").addEventListener("keyup", (e: KeyboardEvent) => {
                const code = e.keyCode;
                if (code === 13) {
                    AddUser();
                }
            });
            document.getElementById("add").addEventListener("mousedown", () => {
                AddUser();
            });
        }

        AddUser(username) {

            const textNode = document.createElement("span");
            textNode.setAttribute("class", "user");
            textNode.textContent = username;

            const deleteButton = document.createElement("a");
            deleteButton.setAttribute("href", "void(0);");
            deleteButton.textContent = "X";
            deleteButton.addEventListener("mousedown", (e: MouseEvent) => {
                const el = (<Element>e.target).parentNode;
                this.ClearUser(el.textContent);

                const usernames = UI.GetUsers();
                saveUsers(usernames);

            });

            const newNode = document.createElement("li");
            newNode.appendChild(textNode);
            newNode.appendChild(deleteButton);

            document.getElementById("users").appendChild(newNode);
        }
        ClearUser (username) {
            const parent = document.getElementById("users");
            const nodeList = parent.childNodes;
            for (let i = nodeList.length; i--; i > 0) {
                if (username === nodeList[i].textContent) {
                    document.getElementById("users").removeChild(nodeList[i]);
                }
            }
        }
        ClearUsers () {
            const parent = document.getElementById("users");
            const nodeList = parent.childNodes;
            for (let i = nodeList.length; i--; i > 0) {
                document.getElementById("users").removeChild(nodeList[i]);
            }
        }
        GetUsername (): string {
            return (<HTMLInputElement>document.getElementById("user")).value;
        }
        ShowError (error) {
            alert(error);
        }
        ClearUsername () {
            (<HTMLInputElement>document.getElementById("user")).value = "";
        }
        FocusUsername () {
            (<HTMLInputElement>document.getElementById("user")).focus();
        }
        GetUsers (): Array<string> {
            const entry = document.getElementById("users").getElementsByClassName("user");
            const usernames = new Array<string>();
            for (let i = 0; i < entry.length; i ++) {
                usernames.push(entry.item(i).textContent);
            }
            return usernames;
        };

    }
    const UI = new UIEntry();

    const saveUsers = (usernames) => {
        const newusers = c.UserConstructor.createUsersByNames(usernames);
        users.setUsers(newusers).then((result) => {
            console.log("Set users", result);
        });
    };

    const AddUser = () => {
        const username = UI.GetUsername();
        if (username) {
            let usernames = UI.GetUsers();
            const isUnique = !(usernames.filter((value) => {
                return value === username;
            }).length);
            if (isUnique) {
                UI.AddUser(username);
                usernames = UI.GetUsers();
                saveUsers(usernames);
                UI.ClearUsername();
                setTimeout(() => {
                    UI.FocusUsername();
                }, 10);
            } else {
                UI.ShowError("already entered user" + username);
            }
        }
    };

    users.getUsers().then((data) => {
        UI.ClearUsers();
        UI.FocusUsername();
        if (data && data.length) {
            const strings: string[] = data.map((user) => {
                return user.name;
            });
            for (let i = 0; i < strings.length; i++) {
                UI.AddUser(strings[i]);
            }
        }
    });

});

