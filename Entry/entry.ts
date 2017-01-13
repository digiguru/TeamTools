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
    
    var getUsers = () => {
        var entry = document.getElementById('users').getElementsByClassName('user');
        var usernames = new Array<string>();
        for (var i=0;i<entry.length;i++) {
            usernames.push(entry.item(i).textContent);
        }
        return usernames;            
    };
    var saveUsers = (usernames) => {
        var newusers = c.UserConstructor.createUsersByNames(usernames);
        window.users.setUsers(newusers).then((result) => {
            console.log("Set users", result);
        });
    }
    var AddUser = () => {
        var username = UIGetUsername();
        if (username) {
            var usernames = getUsers();
            var isUnique = !(usernames.filter((value) => {
                return value === username;
            }).length);
            if(isUnique) {
                UIAddUser(username);
                usernames = getUsers();
                saveUsers(usernames);
                UIClearUsername();
                setTimeout(() => { UIFocusUsername()},10);
            } else {
                UIShowError("already entered user" + username);
            }
            
        }
    };
    var UIAddUser = (username) => {
        
        var textNode = document.createElement("span");
        textNode.setAttribute("class", "user");
        textNode.textContent = username;

        var deleteButton = document.createElement("a");
        deleteButton.setAttribute("href", "void(0);");
        deleteButton.textContent = "X";
        deleteButton.addEventListener("mousedown", (e:MouseEvent) => {
            var el = e.target.parentNode;
            UIClearUser(el.textContent);
            
            var usernames = getUsers();
            saveUsers(usernames);
                    
        });

        var newNode = document.createElement("li");
        newNode.appendChild(textNode);
        newNode.appendChild(deleteButton);

        document.getElementById('users').appendChild(newNode);
    }
    var UIClearUser = (username) => {
        var parent = document.getElementById('users');
        var nodeList = parent.childNodes;
        for (var i=nodeList.length;i--;i>0) {
            if(username === nodeList[i].textContent) {
                document.getElementById('users').removeChild(nodeList[i]);
            }  
        }
    }
    var UIClearUsers = () => {
        var parent = document.getElementById('users');
        var nodeList = parent.childNodes;
        for (var i=nodeList.length;i--;i>0){
            document.getElementById('users').removeChild(nodeList[i]);
        }
    }
    var UIGetUsername = () => {
        return document.getElementById('user').value;
    }
    var UIShowError = (error) => {
        alert(error);
    }
    var UIClearUsername = () => {
        document.getElementById('user').value = "";
    }
    var UIFocusUsername = () => {
        document.getElementById('user').focus();
    }

    users.getUsers().then((data) => {
        UIClearUsers();
        UIFocusUsername();
        if (data && data.length) {
            const strings:string[] = data.map((user) => {
                return user.name;
            });
            for (var i=0;i<strings.length;i++) {
                UIAddUser(strings[i]);
            }
        }

        document.getElementById('new').addEventListener("mousedown", () => {
            UIClearUsers();
        });
        document.getElementById('user').addEventListener("keyup", (e:KeyboardEvent) => {
            var code = e.keyCode;
            if(code === 13) {
                AddUser();
            }
        });
        document.getElementById('add').addEventListener("mousedown", AddUser);
        
        
    });
    
});

