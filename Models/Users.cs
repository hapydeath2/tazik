using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class Users
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } // Owner, Admin, Seller, Buyer
    }
}