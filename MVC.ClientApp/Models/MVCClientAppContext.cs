using Microsoft.EntityFrameworkCore;

namespace MVC.ClientApp.Models
{
    public class MVCClientAppContext : DbContext
    {
        public MVCClientAppContext(DbContextOptions<MVCClientAppContext> options)
            : base(options)
        {
        }
        public DbSet<Client> Clients { get; set; }
    }
}
