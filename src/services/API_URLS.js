// Helper function to generate full routes dynamically
const generateFullRoutes = (resource) => {
  return Object.keys(resource.routes).reduce((acc, key) => {
    acc[key] = `${resource.baseRoute}${resource.routes[key]}`;
    return acc;
  }, {});
};

const APIs = {
  // Resource-specific route definitions
  TABLES: {
    baseRoute: "/tables",
    routes: {
      CREATE_TABLE: "/create",
      DELETE_TABLE: "/delete",
      UPDATE_TABLE: "/update",
      GET_TABLES: "/",
      GET_TABLE_BY_ID: "/",
    },
  },

  USERS: {
    baseRoute: "/users",
    routes: {
      CREATE_USER: "/create",
      DELETE_USER: "/delete",
      UPDATE_USER: "/update",
      GET_USERS: "/",
      GET_USER_BY_ID: "/:id",
    },
  },

  // Dynamically generate and attach full routes to each resource
  getFullRoutes() {
    const fullRoutes = {};
    Object.keys(this).forEach((resource) => {
      if (this[resource].routes) {
        fullRoutes[resource] = generateFullRoutes(this[resource]);
      }
    });
    return fullRoutes;
  },
};

// Dynamically get full routes for all resources
const API_URLS = APIs.getFullRoutes();
console.log(API_URLS);

// Exporting dynamically based on resources
export default API_URLS;
