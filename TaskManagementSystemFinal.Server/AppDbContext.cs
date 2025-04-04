﻿using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Server.Items;
using TaskManagementSystemFinal.Server.Items;

namespace TaskManagementSystem.Server
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<TaskItem> TaskItems { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Message> Messages { get; set; }
    }
}
