using TaskManagementSystem.Server.Items;

namespace TaskManagementSystemFinal.Server.Items
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string MessageText { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;

        public User Sender { get; set; }
        public User Receiver { get; set; }
    }
}
