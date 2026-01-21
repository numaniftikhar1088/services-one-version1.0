CREATE TABLE [dbo].[tblUserRole] (
    [UserId]      NVARCHAR (300) NOT NULL,
    [RoleId]      INT            NOT NULL,
    [SubRoleType] INT            NULL,
    CONSTRAINT [PK_tblUserRole] PRIMARY KEY CLUSTERED ([UserId] ASC, [RoleId] ASC),
    CONSTRAINT [FK_tblUserRole_tblRole] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[tblRole] ([Id])
);

