using backend.Models;
using MongoDB.Driver;

namespace backend.Data
{
    public class MongoService
    {
        private readonly IMongoDatabase _database;

        public MongoService(IConfiguration config)
        {
            var client = new MongoClient(config["Mongo:Connection"]);
            _database = client.GetDatabase(config["Mongo:Database"]);
        }

        public IMongoCollection<Users> Users =>
            _database.GetCollection<Users>("Users");

        public IMongoCollection<Order> Orders =>
            _database.GetCollection<Order>("Orders");
    }
}