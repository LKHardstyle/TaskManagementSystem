using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Server;
using TaskManagementSystem.Server.Items;
using TaskManagementSystemFinal.Server.Items;
using TaskManagementSystemFinal.Server.Requests;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<ChatHub> _hubContext;

    public ChatController(IHubContext<ChatHub> hubContext, AppDbContext context)
    {
        _hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    // Nachrichten zwischen zwei Usern abrufen
    [HttpGet("{userId}/{otherUserId}")]
    public async Task<ActionResult<IEnumerable<Message>>> GetMessages(int userId, int otherUserId)
    {
        var messages = await _context.Messages
            .Where(m => (m.SenderId == userId && m.ReceiverId == otherUserId) ||
                        (m.SenderId == otherUserId && m.ReceiverId == userId))
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        return Ok(messages);
    }

    // Neue Nachricht senden
    [HttpPost()]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest message)
    {
        if (string.IsNullOrWhiteSpace(message.MessageText))
        {
            return BadRequest("Nachricht darf nicht leer sein.");
        }

        var newMessage = new Message
        {
            SenderId = message.SenderId,
            ReceiverId = message.ReceiverId,
            MessageText = message.MessageText,
            SentAt = DateTime.UtcNow,
            IsRead = false,
        };

        _context.Messages.Add(newMessage);
        await _context.SaveChangesAsync();

        //'_hubContext` richtig nutzen
        if (_hubContext != null)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", message.SenderId, message.MessageText);
        }
        else
        {
            Console.WriteLine("_hubContext ist NULL!");
        }

        return Ok(new { newMessage.Id, newMessage.SentAt });
    }


    [HttpPut("{messageId}/read")]
    public async Task<IActionResult> MarkMessageAsRead(int messageId)
    {
        var message = await _context.Messages.FindAsync(messageId);
        if (message == null)
        {
            return NotFound();
        }

        message.IsRead = true;
        await _context.SaveChangesAsync();

        // **DEBUGGING LOG**
        Console.WriteLine($"Sende Nachricht an {message.ReceiverId}: {message.MessageText}");

        // SignalR Event senden
        await _hubContext.Clients.All.SendAsync("MessageRead", messageId);        

        return NoContent();
    }

    [HttpGet("{userId}/chat-partners")]
    public async Task<ActionResult<IEnumerable<User>>> GetChatPartners(int userId)
    {
        var chatPartnerIds = await _context.Messages
            .Where(m => m.SenderId == userId || m.ReceiverId == userId)
            .Select(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
            .Distinct()
            .ToListAsync();

        var chatPartners = await _context.Users
            .Where(u => chatPartnerIds.Contains(u.Id))
            .ToListAsync();

        return Ok(chatPartners);
    }

}
