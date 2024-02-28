 
 
const creds = {
  cookieSecret: 'cookie',
  mongo: {
    development: {
      connectionString: 'mongodb://localhost:27017' // Defaults to localhost, change if using Mongodb Atlas
    },
    production: {
      connectionString: 'mongodb+srv://doadmin:aV3wc6078uCL9g14@db-mongodb-nyc1-tv-guide-app-2ee665f1.mongo.ondigitalocean.com'
    },
  }
};

export default creds;
