CREATE TABLE [dbo].[tblControlPortalTypes] (
    [ID]           INT            IDENTITY (1, 1) NOT NULL,
    [PortalTypeID] INT            NOT NULL,
    [ControlID]    INT            NOT NULL,
    [CreatedBy]    NVARCHAR (MAX) NOT NULL,
    [CreatedDate]  DATETIME2 (7)  NOT NULL,
    [UpdatedBy]    NVARCHAR (MAX) NULL,
    [UpdatedDate]  DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblControlPortalTypes] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_tblControlPortalTypes_tblControls] FOREIGN KEY ([ControlID]) REFERENCES [dbo].[tblControls] ([ID]),
    CONSTRAINT [FK_tblControlPortalTypes_tblOptionLookup] FOREIGN KEY ([PortalTypeID]) REFERENCES [dbo].[tblOptionLookup] ([Id])
);

