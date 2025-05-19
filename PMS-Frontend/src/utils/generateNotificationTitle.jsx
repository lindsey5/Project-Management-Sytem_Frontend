export default function generateNotificationTitle(notification) {
    const notificationTitles = {
        TaskAssigned: "assigned a task to you",
        TaskRemoved: "removed you from a task",
        TaskUpdated: "updated a task",
        AttachmentAdded: "added an attachment",
        AttachmentRemoved: "removed an attachment",
        RemovedToProject: "removed you from a project",
        RequestAccepted: "accepted your request",
        CommentAdded: "added a comment",
        TaskDeleted: "deleted a task",
        RoleUpdated: "updated your role",
        LeftFromProject: "left the project",
        ProjectUpdated: "updated a project",
        ProjectDeleted: "deleted a project",
        InvitationSent: "invited you to join a project",
        InvitationAccepted: "accepted your invitation",
    };

    return notificationTitles[notification.type] || null;
}
