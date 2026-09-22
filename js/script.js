let editRowIndex = null;

let launchedRooms =
  JSON.parse(localStorage.getItem("launchedRooms")) || [];

function getFormData() {
  return {
    location: document.getElementById("location").value.trim(),
    roomNo: document.getElementById("roomNo").value.trim(),
    reservation: document.getElementById("reservation").value,
    registeredDate: document.getElementById("registeredDate").value,
    time: document.getElementById("time").value,
    totalPeople: document.getElementById("totalPeople").value,
    promotionalCode:
      document.getElementById("promotionalCode").value.trim(),
    price: document.getElementById("price").value,
    status: "Not Checked-in",
  };
}


function clearForm() {
  const bookingForm = document.getElementById("bookingForm");

  if (bookingForm) {
    bookingForm.reset();
  }
}


function prepareNew() {
  editRowIndex = null;

  clearForm();

  document.getElementById("modalTitle").textContent = "Add room";
  document.getElementById("saveButton").textContent = "Add room";
}

function persistRooms() {
  localStorage.setItem(
    "launchedRooms",
    JSON.stringify(launchedRooms)
  );

  displayLaunchedRooms();
}

function saveRoom() {
  const room = getFormData();

  const requiredFieldsComplete =
    room.location &&
    room.roomNo &&
    room.registeredDate &&
    room.time &&
    room.totalPeople &&
    room.price !== "";

  if (!requiredFieldsComplete) {
    alert("Please complete all required room details.");
    return;
  }

  if (editRowIndex === null) {
    launchedRooms.push(room);
  } else {
    launchedRooms[editRowIndex] = {
      ...launchedRooms[editRowIndex],
      ...room,
    };
  }

  persistRooms();

  const modalElement = document.getElementById("myModal");

  const modal =
    bootstrap.Modal.getOrCreateInstance(modalElement);

  modal.hide();

  clearForm();
}


function editRow(button) {
  editRowIndex = Number(button.dataset.index);

  const room = launchedRooms[editRowIndex];

  if (!room) {
    return;
  }

  const fields = [
    "location",
    "roomNo",
    "reservation",
    "registeredDate",
    "time",
    "totalPeople",
    "promotionalCode",
    "price",
  ];

  fields.forEach((field) => {
    const input = document.getElementById(field);

    if (input) {
      input.value = room[field] ?? "";
    }
  });

  document.getElementById("modalTitle").textContent =
    "Edit room";

  document.getElementById("saveButton").textContent =
    "Save changes";

  const modalElement = document.getElementById("myModal");

  const modal =
    bootstrap.Modal.getOrCreateInstance(modalElement);

  modal.show();
}

function deleteRow(button) {
  const index = Number(button.dataset.index);

  const room = launchedRooms[index];

  if (!room) {
    return;
  }

  const confirmed = confirm(
    `Remove Room ${room.roomNo} from ${room.location}?`
  );

  if (!confirmed) {
    return;
  }

  launchedRooms.splice(index, 1);

  persistRooms();
}

function displayLaunchedRooms() {
  const tableBody =
    document.querySelector("#bookingTable tbody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

  launchedRooms.forEach((room, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>

      <td>
        <strong>${room.location}</strong>
      </td>

      <td>${room.roomNo}</td>

      <td>
        ${room.reservation === "Y" ? "Yes" : "No"}
      </td>

      <td>${room.registeredDate}</td>

      <td>${room.time}</td>

      <td>${room.totalPeople}</td>

      <td>
        ${room.promotionalCode || "—"}
      </td>

      <td>
        <strong>
          $${Number(room.price || 0).toLocaleString()}
        </strong>
      </td>

      <td>
        <button
          class="table-action"
          type="button"
          data-index="${index}"
          onclick="editRow(this)"
          title="Edit room"
          aria-label="Edit room"
        >
          ✏️
        </button>

        <button
          class="table-action"
          type="button"
          data-index="${index}"
          onclick="deleteRow(this)"
          title="Delete room"
          aria-label="Delete room"
        >
          🗑️
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  updateManagedRoomCount();
}

function updateManagedRoomCount() {
  const managedCount =
    document.getElementById("managedCount");

  if (managedCount) {
    managedCount.textContent = launchedRooms.length;
  }
}

function submitRow() {
  saveRoom();
}


function updateRow() {
  saveRoom();
}

function logout() {
  sessionStorage.removeItem("currentUser");
  location.href = "index.html";
}

document.addEventListener(
  "DOMContentLoaded",
  displayLaunchedRooms
);