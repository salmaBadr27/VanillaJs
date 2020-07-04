import * as firebase from "firebase/app";
import "firebase/database";
import { firebaseConfig } from "./config";

firebase.initializeApp(firebaseConfig);

//get all data in yourDb
export function getAllData() {
  return firebase
    .database()
    .ref()
    .once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
      });
    });
}
export function formValidation() {
  var desc = document.getElementById("desc").value;
  var title = document.getElementById("title").value;
  if (desc == "" || title == "") {
    document.getElementById("desc").classList.add("error");
    document.getElementById("title").classList.add("error");
    document
      .getElementById("desc")
      .setAttribute("placeholder", "Required Field");
    document
      .getElementById("title")
      .setAttribute("placeholder", "Required Field");

    return false;
  }

  document.getElementById("desc").classList.remove("error");
  document.getElementById("title").classList.remove("error");
  document.getElementById("desc").setAttribute("placeholder", "Describtion");
  document.getElementById("title").setAttribute("placeholder", "Title");
  return true;
}
//add newItem
export function addNewItem() {
  var toDoNums = document.getElementsByTagName("li").length;
  var desc = document.getElementById("desc").value;
  var title = document.getElementById("title").value;

  if (toDoNums >= 20) {
    swal("Oops!", "you have reached the maximum num of toDos", "error");
  } else {
    var err = document.getElementById("err");
    if (err !== null) {
      err.remove();
    }
    var id =
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 4);
    var toDoRef = firebase.database().ref(id);
    toDoRef.set({
      description: desc,
      state: "active",
      title: title
    });

    document.getElementById("desc").value = "";
    document.getElementById("title").value = "";
    createListItems(id, title, "active");
  }
}

export function createListItems(id, title, state) {
  getAllData().then(data => {
    var object = data.val();
    var list =
      object == null
        ? document.createElement("ul")
        : document.getElementsByTagName("ul")[0];
    var listItem = document.createElement("li");
    var listTitle = document.createElement("span");
    listItem.id = id;
    listTitle.id = "titleItem";

    listItem.className = state == "active" ? "" : "checked";
    var listId = object == null ? "myUL" : "";
    listTitle.innerHTML = title;
    listTitle.contentEditable = true;
    var removeBtn = document.createElement("span");
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.className = "done";
    checkBox.checked = state == "active" ? false : true;

    removeBtn.className = "fa fa-trash";
    listItem.appendChild(listTitle);
    listItem.appendChild(removeBtn);
    listItem.appendChild(checkBox);

    if (object == null) {
      document.body.appendChild(list);
    } else {
      document.getElementsByTagName("ul")[0].appendChild(listItem);
    }

    //remove todo
    removeBtn.onclick = function() {
      deleteItem(id);
    };

    //mark todo as done
    checkBox.onclick = function() {
      if (this.checked == true) {
        listItem.className = "checked";
        markAsDone(id);
      } else {
        listItem.className = "";
        markAsActive(id);
      }
    };

    //edit todo
    listTitle.addEventListener("input", function() {
      listTitle.addEventListener("keydown", function(event) {
        var editiedToDo = document.getElementById(id).textContent;
        if (event.keyCode === 13) {
          listTitle.value = editiedToDo;
          event.preventDefault();
          this.contentEditable = false;
          editItem(id, editiedToDo);
          this.contentEditable = true;
        }
      });
    });
  });
}

//edit existed item by id
export function editItem(itemId, title) {
  var itemRef = firebase
    .database()
    .ref(itemId)
    .update({
      title: title
    });
}

//mark todo as done
export function markAsDone(itemId) {
  var itemRef = firebase
    .database()
    .ref(itemId)
    .update({
      state: "done"
    });
}

//mark todo as active
export function markAsActive(itemId) {
  var itemRef = firebase
    .database()
    .ref(itemId)
    .update({
      state: "active"
    });
}
//delete specific item from db
export function deleteItem(itemId) {
  var deleteItem = document.getElementById(itemId);
  var deletedRef = firebase.database().ref(itemId);

  deletedRef.once("value").then(function(snapshot) {
    var updates = {};
    snapshot.forEach(function(child) {
      updates[child.key] = null;
    });
    deletedRef.update(updates);
  });
  deleteItem.remove();
  var remainedItems = document.getElementsByTagName("ul")[0].childNodes.length;
  var msg = document.createElement("li");
  msg.innerHTML =
    "Great you have Finished your ToDos!!!... Sure you have more to do :D";
  msg.id = "err";
  remainedItems == 0
    ? document.getElementsByTagName("ul")[0].appendChild(msg)
    : "";
}
