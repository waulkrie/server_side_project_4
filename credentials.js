 
 
const creds = {
  cookieSecret: 'cookie',
  mongo: {
    development: {
      connectionString: 'mongodb://localhost:27017' // Defaults to localhost, change if using Mongodb Atlas
    },
    production: {
      
    },
  }
};

export default creds;
