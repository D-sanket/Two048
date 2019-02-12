$(document).ready(function () {

    var ip = null;

    //$.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function (data) {
    //     ip = data["geobytesremoteip"];
    ip = "127.0.0.2";
    var docData = {
        name: "",
        timestamp: Date.now()
    };

    var userRef = db.collection('users').doc(ip);

    userRef.get()
        .then(doc => {
            if (!doc.exists) {
                userRef
                    .set(docData)
                    .then(function () {
                        initHome(ip, docData);
                    })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });
                //});
            } else {
                var data = doc.data();
                var name = data.name == "" ? "Anonymous" : data.name;
                data.timestamp = Date.now();
                userRef
                    .set(data)
                    .then(function () {
                        initHome(ip, data);
                    })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });


});

function initHome(ip, data){
    var username = data.name == "" ? "Anonymous" : data.name;
    $("#username").html("Hello, "+username+"!");
    $("#ip").html(ip);

    db.collection("users")
        .onSnapshot(function(querySnapshot) {
            var users = [];
            querySnapshot.forEach(function(doc) {
                var docData = doc.data();
                docData.ip = doc.id;

                users.push(docData);

            });
            showUsers(ip, users);
        });
}

function showUsers(ip, users) {
    var html = "";
    for(var i=0; i<users.length; i++){
        if(users[i].ip != ip)
            html += "<li class='user'>"+users[i].ip+" "+(users[i].name ? "("+users[i].name+")" : "(Anonymous)")+" <a href='./game.html?playWith="+users[i].ip+"'>Play</a></li>";
    }

    html = "<ul>" + html + "</ul>";

    $("#playerDiv").html(html);
}
