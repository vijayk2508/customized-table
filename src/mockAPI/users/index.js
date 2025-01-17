import mock from "../mock";
import usersData from "../data/user.json"; // Import the JSON data

// In-memory data storage
let users = usersData.users;

// CRUD operations

// GET: Retrieve all users with pagination and multiple filters
mock.onGet("/api/users").reply((config) => {
  // Extract query parameters
  const params = new URLSearchParams(config.params);
  const page = parseInt(params.get("page")) || 1; // Default to page 1 if not provided
  const limit = parseInt(params.get("limit")) || 10; // Default to 10 users per page if not provided

  // Filters
  const filters = {
    name: params.get("name") || null,
    email: params.get("email") || null,
    age: params.get("age") || null,
  };

  // Filter users based on query parameters
  let filteredUsers = users;

  if (filters.name) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(filters.name.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filters.name.toLowerCase())
    );
  }

  if (filters.email) {
    filteredUsers = filteredUsers.filter((user) =>
      user.email.toLowerCase().includes(filters.email.toLowerCase())
    );
  }

  if (filters.age) {
    filteredUsers = filteredUsers.filter(
      (user) => user.age === parseInt(filters.age)
    );
  }

  // Pagination logic
  const total = filteredUsers.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Response metadata
  const response = {
    success: true,
    data: paginatedUsers,
    total, // Total number of filtered users
    page, // Current page
    limit, // Limit per page
    totalPages: Math.ceil(total / limit), // Total pages
  };

  return [200, response];
});

// GET: Retrieve a single user by ID
mock.onGet(new RegExp("/api/users/\\w+")).reply((config) => {
  const id = config.url.split("/").pop();
  const user = users.find((u) => u.id === id);
  if (user) {
    return [200, { success: true, data: user }];
  } else {
    return [404, { success: false, message: "User not found" }];
  }
});

// POST: Create a new user
mock.onPost("/api/users").reply((config) => {
  const newUser = JSON.parse(config.data);
  newUser.id = new Date().getTime().toString(); // Simple ID generation
  users.push(newUser);
  return [201, { success: true, data: newUser }];
});

// PUT: Update a user by ID
mock.onPut(new RegExp("/api/users/\\w+")).reply((config) => {
  const id = config.url.split("/").pop();
  const updatedUser = JSON.parse(config.data);
  const index = users.findIndex((u) => u.id === id);

  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    return [200, { success: true, data: users[index] }];
  } else {
    return [404, { success: false, message: "User not found" }];
  }
});

// DELETE: Delete a user by ID
mock.onDelete(new RegExp("/api/users/\\w+")).reply((config) => {
  const id = config.url.split("/").pop();
  const index = users.findIndex((u) => u.id === id);

  if (index !== -1) {
    const deletedUser = users.splice(index, 1);
    return [200, { success: true, data: deletedUser[0] }];
  } else {
    return [404, { success: false, message: "User not found" }];
  }
});

export default mock;