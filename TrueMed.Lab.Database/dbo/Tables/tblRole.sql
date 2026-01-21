CREATE TABLE [dbo].[tblRole] (
    [Id]         INT            IDENTITY (1, 1) NOT NULL,
    [Name]       NVARCHAR (MAX) NOT NULL,
    [RoleType]   INT            NULL,
    [CreateDate] DATETIME2 (7)  NOT NULL,
    [CreateBy]   NVARCHAR (MAX) NOT NULL,
    [UpdateBy]   NVARCHAR (MAX) NULL,
    [UpdateDate] DATETIME2 (7)  NULL,
    [IsDeleted]  BIT            CONSTRAINT [DF_tblRole_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblRole] PRIMARY KEY CLUSTERED ([Id] ASC)
);

