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

    console.log("Starting");
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
    users.getUsers().then((data) => {
        UIClearUsers();
        console.log("Have these users", data);
        if (data && data.length) {
            const strings:string[] = data.map((user) => {
                return user.name;
            });
            console.log("see", strings);
            for (var i=0;i<strings.length;i++) {
                console.log("ADD", strings[i]);
                UIAddUser(strings[i]);
            }
            /*const text = strings.join("\n");
            console.log("is", text);

            document.getElementById('user').value = text;
            */
        }

        document.getElementById('new').addEventListener("mousedown", () => {
            UIClearUsers();
        });
        document.getElementById('add').addEventListener("mousedown", () => {
            var username = document.getElementById('user').value;
            if (username) {
                var usernames = getUsers();
                var isUnique = !(usernames.filter((value) => {
                   return value === username;
                }).length);
                if(isUnique) {
                    UIAddUser(username);
                    saveUsers(usernames);
                } else {
                    alert("already entered");
                }
                
            }
        });
    });
    
});

