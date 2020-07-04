import { getAllData, createListItems } from "../utils/helpers";
import { join } from "path";

export default function listComponent() {
  var list = document.createElement("ul");
  list.id = "myUL ";
  var Msg = document.createElement("li");
  Msg.id = "err";
  var recievedData = getAllData()
    .then(data => {
      var object = data.val();
      if (object == null) {
        Msg.innerHTML = "Write your first ToDo :D";
        list.appendChild(Msg);
        document.body.appendChild(list);
      } else {
        const map = new Map(Object.entries(object));
        map.forEach((ele, index) => {
          createListItems(index, ele.title, ele.state);
        });

        //append list to body
        document.body.appendChild(list);
        localStorage.setItem("listItems", JSON.stringify(object));
      }
    })
    .catch(error => {
      swal("Oops!", "Something errot", "error");
    });
}
