let users = [
  { id: 1, name: "Ali", age: 21, city: "Tashkent" },
  { id: 2, name: "Vali", age: 32, city: "Namangan" },
  { id: 3, name: "Hasan", age: 43, city: "Samarqand" },
];

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  const userId = Number(req.query?.id);

  if (req.method === "GET") {
    return res.status(200).json(users);
  }

  if (req.method === "POST") {
    const body = req.body;
    const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);

    const newUser = {
      ...body,
      id: maxId + 1,
      age: Number(body.age),
    };

    users.push(newUser);

    return res.status(201).json({
      ...newUser,
      status: "success",
    });
  }

  if (req.method === "PUT") {
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({
        xato: "Bunday foydalanuvchi mavjud emas",
      });
    }

    user.name = req.body.name;
    user.age = Number(req.body.age);
    user.city = req.body.city;

    return res.status(200).json({
      ...user,
      status: "success",
    });
  }

  if (req.method === "DELETE") {
    const exists = users.some((u) => u.id === userId);

    if (!exists) {
      return res.status(404).json({
        xato: "Bunday foydalanuvchi mavjud emas",
      });
    }

    users = users.filter((u) => u.id !== userId);

    return res.status(200).json({
      status: "success",
    });
  }

  res.setHeader("Allow", "GET, POST, PUT, DELETE");
  return res.status(405).json({
    xato: "Method noto'g'ri",
  });
}
