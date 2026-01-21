CREATE TABLE [dbo].[tblCompendiumGroupPanelsAssignment] (
    [ID]               INT            IDENTITY (1, 1) NOT NULL,
    [GroupID]          INT            NULL,
    [PanelID]          INT            NULL,
    [PanelDisplayName] NVARCHAR (MAX) NULL,
    [DisplayTypeID]    INT            NULL,
    [SortOrder]        INT            NULL,
    [IsActive]         BIT            CONSTRAINT [DF_tblCompendiumGroupPanelsAssignment_isActive] DEFAULT ((1)) NOT NULL,
    [IsDeleted]        BIT            CONSTRAINT [DF_tblCompendiumGroupPanelsAssignment_isDeleted] DEFAULT ((0)) NOT NULL,
    [CreatedBy]        NVARCHAR (MAX) NOT NULL,
    [CreatedDate]      DATETIME2 (7)  NOT NULL,
    [UpdatedBy]        NVARCHAR (MAX) NULL,
    [UpdatedDate]      DATETIME2 (7)  NULL,
    [DeletedBy]        NVARCHAR (MAX) NULL,
    [DeletedDate]      DATETIME2 (7)  NULL,
    [OrderCode]        NVARCHAR (MAX) NULL,
    [ResultCode]       NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblCompendiumGroupPanelsAssignment] PRIMARY KEY CLUSTERED ([ID] ASC)
);

