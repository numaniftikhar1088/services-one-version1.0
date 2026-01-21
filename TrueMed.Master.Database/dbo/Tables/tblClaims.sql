CREATE TABLE [dbo].[tblClaims] (
    [Id]       INT            IDENTITY (1, 1) NOT NULL,
    [ParentId] INT            NULL,
    [Name]     NVARCHAR (300) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

