CREATE TABLE [dbo].[tblCompendiumPanelType] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [PanelType]   NVARCHAR (MAX) NULL,
    [Description] NVARCHAR (MAX) NULL,
    [IsActive]    BIT            NULL,
    [IsDeleted]   BIT            NULL,
    [CreatedBy]   NVARCHAR (MAX) NULL,
    [CreatedDate] DATETIME       NULL,
    [UpdatedBy]   NVARCHAR (MAX) NULL,
    [UpdatedDate] DATETIME       NULL,
    [DeletedBy]   NVARCHAR (MAX) NULL,
    [DeletedDate] DATETIME       NULL,
    [ReqTypeId]   INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

