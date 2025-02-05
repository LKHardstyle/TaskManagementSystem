namespace TaskManagementSystemFinal.Server.Requests
{
    public class SendMessageRequest
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string MessageText { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
