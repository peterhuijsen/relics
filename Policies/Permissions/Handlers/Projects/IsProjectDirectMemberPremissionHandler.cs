using System.Security.Claims;
using Backend.Core.Services.Projects;
using Backend.Policies.Permissions.Extensions;
using Backend.Policies.Permissions.Variants.Projects;
using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Policies.Permissions.Handlers.Projects;

/// <inheritdoc cref="IPermissionHandler{T}"/>
public class IsProjectDirectMemberPermissionHandler : IPermissionHandler<IsProjectDirectMemberPermission>
{
    private readonly IProjectService _projectService;
    
    public IsProjectDirectMemberPermissionHandler(IProjectService projectService)
    {
        _projectService = projectService;
    }
    
    /// <inheritdoc cref="IPermissionHandler{T}.Handle"/>
    public void Handle(IsProjectDirectMemberPermission permission, IMiddlewareContext middleware, AuthorizationHandlerContext context)
    {
        // Retrieve the id of the authenticated user
        var idClaim = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (idClaim is null || !Guid.TryParse(idClaim.Value, out var userId))
            return;
        
        // Retrieve the id of the project
        if (!middleware.GetValue<Guid>(permission.Identifier, out var projectId) || !projectId.HasValue)
            return;

        // Retrieve the project
        var project = _projectService.Get(projectId);
        
        // Check if the authenticated user is a member of the project
        var isDirectMember = project.Members.Any(m => m.UserId == userId);
        if (!isDirectMember)
            return;
        
        context.Succeed(permission);
    }
}