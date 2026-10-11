import {
    createServer
} from "node:http";

let users = [{
        id: 1,
        name: "Ali",
        age: 21,
        city: "Tashkent",
    },
    {
        id: 2,
        name: "Vali",
        age: 32,
        city: "Namangan",
    },
    {
        id: 3,
        name: "Hasan",
        age: 43,
        city: "Samarqand",
    },
];

const server = createServer((req, res) => {
    ///////////
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }
    ////////////

    try {

        if (req.url.startsWith("/users")) {
            console.log("/users ga so'rov kleib tushdi!");

            if (req.method === "GET") {
                res.writeHead(200, "Muvaffaqiyatli javob keldi!");
                res.end(JSON.stringify(users));

            } else if (req.method === "PUT" && req.url.startsWith("/users/")) {
                console.log("PUT sorovi keldi");

                const userId = req.url.split("/")[2];
                const updatingUser = users.find((user) => user.id === parseInt(userId));

                if (!updatingUser) {
                    res.writeHead(404);
                    res.end(JSON.stringify({
                        xato: "Bunday foydalanuvchi mavjud emas"
                    }));
                    return;
                }

                let newBody = "";
                req.on("data", (chunk) => {
                    newBody += chunk;
                });

                req.on("end", () => {
                    if (!updatingUser) {
                        res.writeHead(404);
                        res.end(JSON.stringify({
                            xato: "Bunday foydalanuvchi mavjud emas"
                        }));
                        return;
                    };
                    const newUserData = JSON.parse(newBody);
                    updatingUser.name = newUserData.name;
                    updatingUser.age = newUserData.age;
                    updatingUser.city = newUserData.city;
                    console.log("Updated: ", updatingUser);

                    res.writeHead(200);
                    res.end(JSON.stringify({
                        ...updatingUser,
                        status: "success"
                    }));
                });
                return;

            } else if (req.method === "POST") {
                let body = "";

                req.on("data", (chunk) => {
                    body += chunk;
                });

                req.on("end", () => {
                    const user = JSON.parse(body);
                    const idsArr = users.reduce((acc, c) => {
                        acc.push(c.id);
                        return acc;
                    }, []);

                    user.id = idsArr.length > 0 ? Math.max(...idsArr) + 1 : 1;
                    users.push(user);
                    console.log("Added: ", user);

                    res.writeHead(201);
                    res.end(
                        JSON.stringify({
                            ...user,
                            status: "success",
                        }),
                    );
                });
            } else if (req.method === "DELETE" && req.url.startsWith("/users/")) {
                console.log("DELETE so'rovi keldi.");

                const userId = req.url.split("/")[2];
                const deletingUser = users.find((user) => user.id === parseInt(userId));
                if (!deletingUser) {
                    res.writeHead(404);
                    res.end(JSON.stringify({ xato: "Bunday foydalanuvchi mavjud emas" }));
                    return;
                }

                users = users.filter((user) => user.id !== parseInt(userId));

                res.writeHead(200);
                res.end(JSON.stringify({
                    status: "success"
                }));

                return;

            } else {
                res.writeHead(405);
                res.end(
                    JSON.stringify({
                        xatolik: "Method noto'g'ri!",
                    }),
                );
                throw new Error("Method noto'g'ri!");
            }

        } else {
            res.writeHead(404);
            res.end(JSON.stringify({
                xatolik: "URL noto'g'ri!"
            }));
            throw new Error("URL noto'g'ri!");
        }

    } catch (err) {
        console.error("Xatolik:", err.message);
    }
});

server.listen(2233, () => {
    console.log("Server 2233-portda ishga tushdi!");
})