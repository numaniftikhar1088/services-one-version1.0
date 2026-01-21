CREATE TABLE [dbo].[tblPages] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [Name]        NVARCHAR (MAX) NULL,
    [LinkUrl]     NVARCHAR (MAX) NULL,
    [ParentId]    INT            NULL,
    [OrderId]     INT            NULL,
    [MenuIcon]    NVARCHAR (MAX) NULL,
    [IsVisible]   BIT            CONSTRAINT [DF__tblMenu__IsVisib__6FE99F9F] DEFAULT ((1)) NOT NULL,
    [CreatedBy]   NVARCHAR (MAX) NULL,
    [CreatedDate] DATETIME2 (7)  NULL,
    [UpdatedBy]   NVARCHAR (MAX) NULL,
    [UpdatedDate] DATETIME2 (7)  NULL,
    [IsActive]    BIT            CONSTRAINT [DF_tblPages_IsActive] DEFAULT ((1)) NULL,
    [ChildID]     INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

