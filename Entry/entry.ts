/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="../Shared/InMemoryBrowserUsers.ts"/>
/// <reference path="../Shared/UserConstructor.ts"/>
requirejs.config( {
    baseUrl : '/'
});

var users;

require(['Shared/InMemoryBrowserUsers', 'Shared/UserConstructor'], function(u, c) {
    users = new u.InMemoryBrowserUsers(window);
    
    class UIEntry {
        constructor() {
            document.getElementById('new').addEventListener("mousedown", () => {
                UI.ClearUsers();
            });
            document.getElementById('user').addEventListener("keyup", (e:KeyboardEvent) => {
                var code = e.keyCode;
                if(code === 13) {
                    AddUser();
                }
            });
            document.getElementById('add').addEventListener("mousedown", AddUser);     
        }

        AddUser(username) {
            
            var textNode = document.createElement("span");
            textNode.setAttribute("class", "user");
            textNode.textContent = username;

            var deleteButton = document.createElement("a");
            deleteButton.setAttribute("href", "void(0);");
            deleteButton.textContent = "X";
            deleteButton.addEventListener("mousedown", (e:MouseEvent) => {
                var el = e.target.parentNode;
                this.ClearUser(el.textContent);
                
                var usernames = UI.GetUsers();
                saveUsers(usernames);
                        
            });

            var newNode = document.createElement("li");
            newNode.appendChild(textNode);
            newNode.appendChild(deleteButton);

            document.getElementById('users').appendChild(newNode);
        }
        ClearUser (username) {
            var parent = document.getElementById('users');
            var nodeList = parent.childNodes;
            for (var i=nodeList.length;i--;i>0) {
                if(username === nodeList[i].textContent) {
                    document.getElementById('users').removeChild(nodeList[i]);
                }  
            }
        }
        ClearUsers () {
            var parent = document.getElementById('users');
            var nodeList = parent.childNodes;
            for (var i=nodeList.length;i--;i>0){
                document.getElementById('users').removeChild(nodeList[i]);
            }
        }
        GetUsername () : string {
            return document.getElementById('user').value;
        }
        ShowError (error) {
            alert(error);
        }
        ClearUsername () {
            document.getElementById('user').value = "";
        }
        FocusUsername () {
            document.getElementById('user').focus();
        }
        GetUsers () : Array<string> {
            var entry = document.getElementById('users').getElementsByClassName('user');
            var usernames = new Array<string>();
            for (var i=0;i<entry.length;i++) {
                usernames.push(entry.item(i).textContent);
            }
            return usernames;            
        };

    }
    var UI = new UIEntry();
    
    var saveUsers = (usernames) => {
        var newusers = c.UserConstructor.createUsersByNames(usernames);
        window.users.setUsers(newusers).then((result) => {
            console.log("Set users", result);
        });
    }

    var AddUser = () => {
        var username = UI.GetUsername();
        if (username) {
            var usernames = UI.GetUsers();
            var isUnique = !(usernames.filter((value) => {
                return value === username;
            }).length);
            if(isUnique) {
                UI.AddUser(username);
                usernames = UI.GetUsers();
                saveUsers(usernames);
                UI.ClearUsername();
                setTimeout(() => { UI.FocusUsername()},10);
            } else {
                UI.ShowError("already entered user" + username);
            }   
        }
    };

    users.getUsers().then((data) => {
        UI.ClearUsers();
        UI.FocusUsername();
        if (data && data.length) {
            const strings:string[] = data.map((user) => {
                return user.name;
            });
            for (var i=0;i<strings.length;i++) {
                UI.AddUser(strings[i]);
            }
        }
    });
    
});

