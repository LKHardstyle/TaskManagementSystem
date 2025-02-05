using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ChatHub : Hub
{
    private static Dictionary<int, string> userConnections = new Dictionary<int, string>();

    public override async Task OnConnectedAsync()
    {
        var userId = Context.GetHttpContext()?.Request.Query["userId"];
        if (int.TryParse(userId, out int parsedUserId))
        {
            userConnections[parsedUserId] = Context.ConnectionId;
            Console.WriteLine($"🟢 Benutzer {parsedUserId} verbunden: {Context.ConnectionId}");
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var userId = Context.GetHttpContext()?.Request.Query["userId"];
        if (int.TryParse(userId, out int parsedUserId) && userConnections.ContainsKey(parsedUserId))
        {
            userConnections.Remove(parsedUserId);
            Console.WriteLine($"🔴 Benutzer {parsedUserId} getrennt.");
        }
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(int senderId, int receiverId, string messageText)
    {
        Console.WriteLine($"📩 Nachricht von {senderId} an {receiverId}: {messageText}");

        if (userConnections.ContainsKey(receiverId))
        {
            await Clients.Client(userConnections[receiverId]).SendAsync("ReceiveMessage", senderId, messageText);
            Console.WriteLine($"📩 Nachricht erfolgreich gesendet an {receiverId}");
        }
        else
        {
            Console.WriteLine($"⚠️ Benutzer {receiverId} ist nicht online!");
        }
    }
}