CREATE TABLE [dbo].[tblApplicationLinks] (
    [Id]             INT            IDENTITY (1, 1) NOT NULL,
    [PermissionLink] NVARCHAR (350) NOT NULL,
    [ModuleId]       INT            NOT NULL,
    [IsPublic]       BIT            NOT NULL,
    [PageId]         INT            NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([ModuleId]) REFERENCES [dbo].[tblModules] ([Id]),
    FOREIGN KEY ([PageId]) REFERENCES [dbo].[tblPages] ([Id])
);



