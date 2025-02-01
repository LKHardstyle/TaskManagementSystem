namespace TaskManagementSystemFinal.Server.Items
{
    // **DTO für Benutzer-Aktualisierung**
    public class UserToEdit
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string NewPassword { get; set; } // Optionales Feld
    }
}
