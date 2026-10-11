const API_URL = "https://first-stack-app.onrender.com/users";
const getBtn = document.getElementById("get_btn");
const getStatus = document.querySelector("#get_status");
const postStatus = document.querySelector("#status_post");

const form = document.querySelector("#form");
const inputName = document.querySelector("#name");
const inputAge = document.querySelector("#age");
const inputAddress = document.querySelector("#address");
const submitBtn = document.querySelector("#submit_btn");

let editUserId = null;

const fetchUsers = async () => {
    getStatus.textContent = "So'rov yuborilmoqda...";
    const controller = new AbortController();
    const timer = setTimeout(() => {
        controller.abort();
    }, 5000);

    try {
        const res = await fetch(API_URL, {
            signal: controller.signal,
        });
        if (!res.ok) {
            getStatus.textContent = "Xatolik yuz berdi.";
            return;
        }
        const data = await res.json();

        getStatus.textContent = "Muvaffaqiyatli.";
        const list = document.querySelector("#list");
        list.innerHTML = "";

        data.forEach((user) => {
            const li = document.createElement("li");
            const spanName = document.createElement("span");
            const spanAge = document.createElement("span");
            const spanAddress = document.createElement("span");
            const editBtn = document.createElement("button");
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete_btn";

            spanName.textContent = `Ism: ${user.name}`;
            spanAge.textContent = `Yosh: ${user.age}`;
            spanAddress.textContent = `Manzil: ${user.city}`;
            editBtn.textContent = "Edit";
            deleteBtn.textContent = "Delete";

            li.append(spanName, spanAge, spanAddress, editBtn, deleteBtn);
            list.append(li);

            editBtn.addEventListener("click", (e) => {
                inputName.value = user.name;
                inputAge.value = user.age;
                inputAddress.value = user.city;
                submitBtn.textContent = "Update";
                editUserId = user.id;
            });

            deleteBtn.addEventListener("click", async () => {
                try {
                    const res = await fetch(`${API_URL}?id=${user.id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    const data = await res.json();
                    if (data.status === "success") {
                        alert("Muvaffaqiyatli o'chirildi.");
                        fetchUsers();
                        if (editUserId === user.id) {
                            inputName.value = "";
                            inputAge.value = "";
                            inputAddress.value = "";
                            submitBtn.textContent = "Submit";
                            editUserId = null;
                        }
                    }
                } catch (err) {
                    console.error("O'chirishda xatolik yuz berdi.", err);
                }
            });
        });
    } catch (err) {
        if (err.name === "AbortError") {
            getStatus.textContent = "Oops! Server javob bermayapti.";
        } else {
            getStatus.textContent = "Qandaydir xatolik yuz berdi.";
            console.error(err);
        }
    } finally {
        clearTimeout(timer);
    }
};
getBtn.addEventListener("click", fetchUsers);

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (
        inputName.value.trim().length < 1 ||
        inputAge.value < 1 ||
        inputAddress.value.trim().length < 1
    )
        return;
    postStatus.textContent = "Yuklanmoqda...";

    try {
        if (editUserId) {
            const res = await fetch(`${API_URL}?id=${editUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: inputName.value,
                    age: inputAge.value,
                    city: inputAddress.value,
                }),
            });
            const data = await res.json();
            if (data.status === "success") {
                postStatus.textContent = "Muvaffaqiyatli yangilandi.";
                fetchUsers();
                inputName.value = "";
                inputAge.value = "";
                inputAddress.value = "";
                console.log(data);
                submitBtn.textContent = "Submit";
                editUserId = null;
            }
        } else {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: inputName.value,
                    age: inputAge.value,
                    city: inputAddress.value,
                }),
            });
            const data = await res.json();
            if (data.status === "success") {
                postStatus.textContent = "Muvaffaqiyatli qo'shildi.";
                fetchUsers();
                inputName.value = "";
                inputAge.value = "";
                inputAddress.value = "";
                console.log(data);
            }
        }
    } catch (err) {
        postStatus.textContent = "Qandaydir xatolik yuz berdi";
        console.error(err);
    }
});