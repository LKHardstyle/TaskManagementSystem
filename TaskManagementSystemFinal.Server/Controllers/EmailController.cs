using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using System.Net;
using TaskManagementSystem.Server;
using TaskManagementSystem.Server.Items;
using TaskManagementSystemFinal.Server.Items;

namespace TaskManagementSystemFinal.Server.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    
    public class EmailController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        public EmailController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("reset-password-email")]
        public async Task<IActionResult> ResetPasswordByEmail([FromBody] PasswordResetEmailRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return NotFound("E-Mail-Adresse nicht gefunden.");
            }

            // **Neues Passwort generieren (oder "Reset123!") setzen**
            string newPassword = "Reset123!";

            // **Passwort in der Datenbank aktualisieren**
            var passwordHasher = new PasswordHasher<User>();
            user.PasswordHash = passwordHasher.HashPassword(user, newPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // **E-Mail an User senden**
            bool emailSent = SendPasswordResetEmail(request.Email, newPassword);
            if (!emailSent)
            {
                return StatusCode(500, "Fehler beim Senden der E-Mail.");
            }

            return Ok("Ein neues Passwort wurde per E-Mail gesendet.");
        }

        // **Funktion zum Senden der E-Mail über GMX SMTP**
        private bool SendPasswordResetEmail(string toEmail, string newPassword)
        {
            try
            {
                var smtpServer = _configuration["EmailSettings:SmtpServer"];
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]);
                var smtpUsername = _configuration["EmailSettings:SmtpUsername"];
                var smtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD", EnvironmentVariableTarget.User);

                var fromAddress = new MailAddress(smtpUsername, "Task Management System");
                var toAddress = new MailAddress(toEmail);
                const string subject = "Passwort zurückgesetzt";
                string body = $"Ihr neues Passwort lautet: {newPassword}\nBitte ändern Sie es nach dem Login.";

                var smtp = new SmtpClient
                {
                    Host = smtpServer,
                    Port = smtpPort,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword)
                };

                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = false
                })
                {
                    smtp.Send(message);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Fehler beim E-Mail-Versand: " + ex.Message);
                return false;
            }
        }
    }
}
