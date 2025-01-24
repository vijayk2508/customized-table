// Import required modules
const fs = require("fs");
const path = require("path");
const { faker } = require("@faker-js/faker");

// Function to generate mock data for tables, columns, and rows
function generateMockData(totalUsers) {
  const tables = [
    {
      id: "1",
      name: "User Table",
    },
  ];

  const columns = [
    {
      id: 1,
      orderIndex: 1,
      title: "Name",
      field: "name",
      tableId: 1,
      editor: "input",
      editable: true,
    },
    {
      id: 2,
      orderIndex: 2,
      title: "Age",
      field: "age",
      tableId: 1,
      editor: "input",
      editable: true,
    },
    {
      id: 3,
      orderIndex: 3,
      title: "Email",
      field: "email",
      tableId: 1,
      editor: "input",
      editable: true,
    },
    {
      id: 4,
      orderIndex: 4,
      title: "Phone",
      field: "phone",
      tableId: 1,
      editor: "input",
      editable: true,
    },
    {
      id: 5,
      orderIndex: 5,
      title: "Address",
      field: "address",
      tableId: 1,
      editor: "input",
      editable: true,
    },
    {
      id: 6,
      orderIndex: 6,
      title: "City",
      field: "city",
      tableId: 1,
      editor: "input",
      editable: true,
    },
    {
      id: 7,
      orderIndex: 7,
      title: "Country",
      field: "country",
      tableId: 1,
      editor: "input",
      editable: true,
    },
    {
      id: 8,
      orderIndex: 8,
      title: "Gender",
      field: "gender",
      tableId: 1,
      editor: "input",
      editable: true,
    },
  ];

  const rows = Array.from({ length: totalUsers }, (_, index) => ({
    id: (index + 1).toString(),
    orderIndex: index + 1,
    field: {
      1: {
        value: faker.person.fullName(),
      },
      2: {
        value: faker.number.int({ min: 18, max: 80 }).toString(),
      },
      3: {
        value: faker.internet.email(),
      },
      4: {
        value: faker.phone.number(),
      },
      5: {
        value: faker.location.streetAddress(),
      },
      6: {
        value: faker.location.city(),
      },
      7: {
        value: faker.location.country(),
      },
      8: {
        value: faker.person.sexType(),
      },
    },
    tableId: 1,
  }));

  return { tables, columns, rows };
}

// Generate mock data (you can adjust the number of users)
const mockData = generateMockData(300); // Change the number of users as needed

// Ensure the directory exists
const dirPath = path.join(__dirname, "public", "data");
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// Write the generated data into org_table.json
const filePath = path.join(dirPath, "new_table.json");
fs.writeFileSync(filePath, JSON.stringify(mockData, null, 2));

console.log("Mock data saved to new_table.json");
