CREATE TABLE [dbo].[tblCompendiumPanels] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [PanelName]   NVARCHAR (MAX) NOT NULL,
    [ReqTypeID]   INT            NULL,
    [TMITCode]    NVARCHAR (MAX) NULL,
    [NetworkType] INT            NULL,
    [isActive]    BIT            NOT NULL,
    [IsDeleted]   BIT            NOT NULL,
    [CreatedBy]   NVARCHAR (MAX) NOT NULL,
    [CreatedDate] DATETIME2 (7)  NOT NULL,
    [UpdatedBy]   NVARCHAR (MAX) NULL,
    [UpdatedDate] DATETIME2 (7)  NULL,
    [DeletedBy]   NVARCHAR (MAX) NULL,
    [DeletedDate] DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblCompendiumPanels] PRIMARY KEY CLUSTERED ([ID] ASC)
);

