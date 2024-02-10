namespace Backend.Policies.Permissions.Variants.Projects;

/// <summary>
/// Whether or not the user is a member of one of the links of the project in the graph request.
/// </summary>
/// <param name="Identifier">The identifier of the parameters in the graph request.</param>
public record IsProjectIndirectMemberPermission(string Identifier = "project") : IPermission;