import { addNewItem, formValidation } from "../utils/helpers";

export default function formComponent() {
  var iconScript = document.createElement("script");
  iconScript.type = "text/javascript";
  iconScript.src = "https://kit.fontawesome.com/a076d05399.js";
  var alertScript = document.createElement("script");
  alertScript.type = "text/javascript";
  alertScript.src = "https://unpkg.com/sweetalert/dist/sweetalert.min.js";
  var body = `<form id="myDIV" class="header" name='addForm' >
            <h2 style="margin:5px">My To Do List</h2>
            <input type="text" id="title" placeholder="Title...">
            <input style="margin-top:5px;height:100px" type="text" id="desc" placeholder="Description...">
            <button class="addBtn" id="add"> Add</button>
            </form>`;

  var form = document.createElement("div");
  form.innerHTML = body;
  document.body.appendChild(form);
  document.body.append(iconScript);
  document.body.append(alertScript);

  document.getElementById("add").onclick = function(e) {
    e.preventDefault();
    formValidation() == true ? addNewItem() : "";
  };
}
