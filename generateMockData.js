// Import required modules
const fs = require("fs");
const path = require("path");
const { faker } = require("@faker-js/faker");

// Function to generate mock users data
function generateMockUsers(total) {
  const users = Array.from({ length: total }, (_, index) => ({
    index: index + 1,
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    dateOfBirth: faker.date.past(30, new Date(2000, 0, 1)),
    image: faker.image.avatar(),
    gender: faker.person.sexType(),
    age: faker.number.int({ min: 18, max: 80 }), // Random age between 18 and 80
  }));

  return { users };
}

// Generate mock users data (you can adjust the number of users)
const mockData = generateMockUsers(300); // Change the number of users as needed

// Ensure the directory exists
const dirPath = path.join(__dirname, "src", "mockAPI/data");
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// Write the generated data into user.json
const filePath = path.join(dirPath, "user.json");
fs.writeFileSync(filePath, JSON.stringify(mockData, null, 2));

console.log("Mock data saved to user.json");
