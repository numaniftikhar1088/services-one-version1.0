CREATE TABLE [dbo].[tblPanels] (
    [PanelID]          INT            IDENTITY (1, 1) NOT NULL,
    [PanelName]        NVARCHAR (MAX) NOT NULL,
    [PanelDisplayName] NVARCHAR (MAX) NULL,
    [TMITCode]         NVARCHAR (50)  NULL,
    [IsActive]         BIT            CONSTRAINT [DF__tblPanelS__Panel__5D95E53A] DEFAULT ((1)) NOT NULL,
    [NetworkType]      NVARCHAR (MAX) NULL,
    [CreatedBy]        NVARCHAR (200) NOT NULL,
    [CreatedDate]      DATETIME2 (7)  NOT NULL,
    [UpdatedBy]        NVARCHAR (200) NULL,
    [UpdatedDate]      DATETIME2 (7)  NULL,
    [DeletedBy]        NVARCHAR (200) NULL,
    [DeletedDate]      DATETIME2 (7)  NULL,
    [IsDeleted]        BIT            CONSTRAINT [DF_tblPanels_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblPanels] PRIMARY KEY CLUSTERED ([PanelID] ASC)
);

