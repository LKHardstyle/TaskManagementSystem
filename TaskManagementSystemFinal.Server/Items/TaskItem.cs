using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskManagementSystem.Server.Items
{
    public class TaskItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        [MaxLength(255)]
        public string AssignedTo { get; set; } // Wer ist für die Aufgabe verantwortlich?

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "To Do"; // "To Do", "In Progress", "Completed"

        [Range(0, 100)]
        public int Progress { get; set; } = 0; // Fortschritt in Prozent (0-100)

        [Required]
        [MaxLength(50)]
        public string Priority { get; set; } = "Medium"; // "Low", "Medium", "High", "Critical"

        [Required]
        public bool IsCompleted { get; set; } = false; // Abgeschlossen oder nicht

        [Required]
        public DateTime DueDate { get; set; } // Fälligkeitsdatum
    }
}
