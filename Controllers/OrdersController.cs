using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly MongoService _mongo;

        public OrdersController(MongoService mongo)
        {
            _mongo = mongo;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateOrder()
        {
            var userId = User.FindFirst("id")?.Value;

            var order = new Order
            {
                BuyerId = userId,
                Status = "Created",
                CreatedAt = DateTime.UtcNow
            };

            await _mongo.Orders.InsertOneAsync(order);
            return Ok(order);
        }

        [Authorize]
        [HttpPost("confirm-payment")]
        public async Task<IActionResult> ConfirmPayment(
            string orderId,
            string txHash,
            decimal amount)
        {
            var update = Builders<Order>.Update
                .Set(o => o.Status, "Paid")
                .Set(o => o.TransactionHash, txHash)
                .Set(o => o.Amount, amount);

            await _mongo.Orders.UpdateOneAsync(
                o => o.Id == orderId,
                update);

            return Ok();
        }
    }
}