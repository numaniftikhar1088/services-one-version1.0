CREATE TABLE [dbo].[tblOptionLookup] (
    [Id]           INT            IDENTITY (1, 1) NOT NULL,
    [Name]         NVARCHAR (MAX) NULL,
    [DisplayOrder] INT            NULL,
    [UserType]     NVARCHAR (30)  NULL,
    [IsActive]     BIT            DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

