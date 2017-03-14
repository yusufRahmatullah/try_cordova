/* Utils */
// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

var costFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });

function validateForm() {
	var name = $("#name").val();
  if (name.length == 0) {
    alert("Please input your name");
  } else {
    var storage = window.localStorage;
    storage.setItem("name", name);
    gotoUrl("home.html");
  }  
}

function initHome() {
  var storage = window.localStorage;
  var name = storage.getItem("name");
  $("#headerText").html(name + "'s Home");

  if (window.staticData === undefined) {
    window.staticData = {};
  }
  getData();
}

function prepareTabs() {
  $("#users").addClass("selected");
  setUsersLayout();

  $("#users").click(function() {
    $("#users").addClass("selected");
    $("#facilities").removeClass("selected");
    setUsersLayout();
  });
  $("#facilities").click(function() {
    $("#facilities").addClass("selected");
    $("#users").removeClass("selected");
    setFacilitiesLayout();
  });
}

function getData() {
  loadFacilities();
  $.getJSON("https://jsonplaceholder.typicode.com/users/", function(data) {
    window.staticData.users = data;
    prepareTabs();
  });
}

function setUsersLayout() {
  var data = window.staticData.users;
  var container = $("#userContainer");
  container.html("");
  for (i = 0, n = data.length; i < n; i++) {
    var item = data[i];
    container.append(userComponent(item.id, item.name, item.email));
  }
}

function setFacilitiesLayout() {
  var data = window.staticData.facilities;
  var container = $("#userContainer");
  var containerString = `
  <button class="center bigButton" onclick="showCheapest();">Show Cheapest</button>
  <table class="facilityContainer">
    <tr>
  `;
  for (i = 0, n = data.length; i < n; i++) {
    var item = data[i];
    containerString += facilityComponent(item.id, item.name, item.thumbnail, item.cost);
    if (i > 0 && i%2 == 1) {
      containerString += "</tr>";
    }
  }
  container.html(containerString);
}

function showCheapest() {
  var facilities = window.staticData.facilities;
  var min = Infinity;
  var minId = -1;
  for (i = 0, n = facilities.length; i < n; i++) {
    if (min > facilities[i].cost) {
      min = facilities[i].cost;
      minId = i;
    }
  }

  var cheapestFac = facilities[minId];
  alert("Cheapest Facility: {0} ({1})".format(cheapestFac.name, costFormat.format(cheapestFac.cost)));
}

function userComponent(id, name, email) {
  return `
    <div class="userItem" onclick="goToUserDetail({0}, '{1}', '{2}');">
      <p class="name">{1}</p>
      <p class="email">{2}</p>
    </div>
  `.format(id, name, email);
}

function facilityComponent(id, name, thumbnail, cost) {
  return `
    <td class="facilityItem">
      <div class="facilityItemBox">
        <img src="{2}" alt="{1}"/>
        <div class="name">{1}</div>
        <div class="cost">{3}</div>
      </div>
    </td>
  `.format(id, name, thumbnail, costFormat.format(cost)); 
}

function goToUserDetail(id, name, email) {
  window.localStorage.setItem("user_id", id);
  window.localStorage.setItem("user_name", name);
  window.localStorage.setItem("user_email", email);
  gotoUrl("user_detail.html");
}

function loadUserDetail() {
  var id = window.localStorage.getItem("user_id");
  var name = window.localStorage.getItem("user_name");
  var email = window.localStorage.getItem("user_email");

  $("#name").html("Name: " + name);
  $("#email").html("E-mail: " + email);
  $("#headerText").html("User Details");
  $.getJSON("https://jsonplaceholder.typicode.com/users/"+id, function(data){
    var address = data.address;
    $("#address").html("Address: {0}, {1}, {2}".format(address.street, address.city, address.zipcode));
    $("#phone").html("Phone: " + data.phone);
    $("#website").html("Website: " + data.website);
  });
}

function setBaseUrl() {
  var baseUrl = window.location.href;
  baseUrl = baseUrl.replace("login.html", "");
  window.localStorage.setItem("baseUrl", baseUrl);
}

function gotoUrl(url) {
  document.location = window.localStorage.getItem("baseUrl") + url;
}


/**
 * Facilities dummy Data preparation
 */
function loadFacilities() {
  window.staticData.facilities = [
    {
      id: 1,
      name: "Tennis Court",
      thumbnail: "http://placehold.it/150/30ac17",
      cost: 20.00
    },
    {
      id: 2,
      name: "Meeting Room",
      thumbnail: "http://placehold.it/150/dff9f6",
      cost: 25.00
    },
    {
      id: 3,
      name: "BBQ Pit",
      thumbnail: "http://placehold.it/150/30ac17",
      cost: 15.00
    },
    {
      id: 4,
      name: "Soccer Field",
      thumbnail: "http://placehold.it/150/dff9f6",
      cost: 10.00
    },
    {
      id: 5,
      name: "Gym",
      thumbnail: "http://placehold.it/150/30ac17",
      cost: 17.50
    },
    {
      id: 6,
      name: "Auditorium",
      thumbnail: "http://placehold.it/150/dff9f6",
      cost: 12.25
    },
    {
      id: 7,
      name: "Class Room",
      thumbnail: "http://placehold.it/150/30ac17",
      cost: 8.50
    },
    {
      id: 8,
      name: "Aerobic Room",
      thumbnail: "http://placehold.it/150/dff9f6",
      cost: 13.00
    }
  ];
}