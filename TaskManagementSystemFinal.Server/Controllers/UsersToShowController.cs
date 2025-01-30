using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Server;
using TaskManagementSystemFinal.Server.Items;

namespace TaskManagementSystemFinal.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersToShowController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersToShowController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<UsersToShow>>> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new UsersToShow
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("id")]
        public async Task<ActionResult<IEnumerable<UsersToShow>>> GetUser(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new UsersToShow
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if(user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
    }
}
