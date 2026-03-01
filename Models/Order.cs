using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string BuyerId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public string TransactionHash { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}