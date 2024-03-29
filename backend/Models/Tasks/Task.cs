using Backend.Models.Projects;
using Backend.Models.Users;

namespace Backend.Models.Tasks;

/// <summary>
/// An object class used to represent a task data model in the application.
/// </summary>
public class Task
{
    /// <summary>
    /// The unique id of the task.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// The name of the task.
    /// </summary>
    public string Name { get; set; } = null!;
    
    /// <summary>
    /// The description of the task.
    /// </summary>
    public string Description { get; set; } = null!;

    /// <summary>
    /// Whether or not the task is finished.
    /// </summary>
    public bool IsFinished { get; set; }

    /// <summary>
    /// The owner of the task.
    /// </summary>
    public Member Owner { get; set; } = null!;

    /// <summary>
    /// The range of comments added to the task.
    /// </summary>
    public List<Comment> Comments { get; set; } = new();
    
    /// <summary>
    /// The range of tags added to the task.
    /// </summary>
    public List<Tag> Tags { get; set; } = new();
}