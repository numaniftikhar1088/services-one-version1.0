CREATE TABLE [dbo].[tblModules] (
    [Id]         INT            IDENTITY (1, 1) NOT NULL,
    [Name]       NVARCHAR (MAX) NOT NULL,
    [CreateDate] DATETIME2 (7)  NULL,
    [CreateBy]   NVARCHAR (MAX) NULL,
    [UpdateDate] DATETIME2 (7)  NULL,
    [UpdateBy]   NVARCHAR (MAX) NULL,
    [OrderID]    INT            NULL,
    [Icon]       NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblModules] PRIMARY KEY CLUSTERED ([Id] ASC)
);

