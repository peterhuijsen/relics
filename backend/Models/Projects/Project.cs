using Backend.Models.Users;
using HotChocolate.Authorization;
using Task = Backend.Models.Tasks.Task;

namespace Backend.Models.Projects;

/// <summary>
/// An object class used to represent the project data model in the application.
/// </summary>
[Authorize]
public class Project
{
    /// <summary>
    /// The unique id of the project.
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// The name of the project.
    /// </summary>
    public string Name { get; set; } = null!;
    
    /// <summary>
    /// The description of the project.
    /// </summary>
    public string Description { get; set; } = null!;

    /// <summary>
    /// The owner of the project.
    /// </summary>
    public Member Owner { get; set; } = null!;
    
    /// <summary>
    /// The range of members in the project.
    /// </summary>
    public List<Member> Members { get; set; } = new List<Member>();
    
    /// <summary>
    /// The range of outgoing invites of the project.
    /// </summary>
    public List<Invite> Invites { get; set; } = new List<Invite>();
    
    /// <summary>
    /// The range of tasks of the project, not linked to a category.
    /// </summary>
    public List<Task> Tasks { get; set; } = new List<Task>();
    
    /// <summary>
    /// The range of categories of the project.
    /// </summary>
    public List<Category> Categories { get; set; } = new List<Category>();
}