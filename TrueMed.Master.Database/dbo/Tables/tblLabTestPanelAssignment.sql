CREATE TABLE [dbo].[tblLabTestPanelAssignment] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [PanelID]     INT            NULL,
    [TestID]      INT            NULL,
    [LabID]       INT            NULL,
    [ReqTypeID]   INT            NULL,
    [CreatedBy]   NVARCHAR (MAX) NULL,
    [CreatedDate] DATETIME       NULL,
    [UpdatedBy]   NVARCHAR (MAX) NULL,
    [UpdatedDate] DATETIME       NULL,
    [DeletedBy]   NVARCHAR (MAX) NULL,
    [DeletedDate] DATETIME       NULL,
    [IsDeleted]   BIT            CONSTRAINT [DF_tblLabTestPanelAssignment_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblLabTestPanelAssignment] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_tblLabTestPanelAssignment_tblLabs] FOREIGN KEY ([LabID]) REFERENCES [dbo].[tblLabs] ([LabId]),
    CONSTRAINT [FK_tblLabTestPanelAssignment_tblPanels] FOREIGN KEY ([PanelID]) REFERENCES [dbo].[tblPanels] ([PanelID]),
    CONSTRAINT [FK_tblLabTestPanelAssignment_tblRequisitionType] FOREIGN KEY ([ReqTypeID]) REFERENCES [dbo].[tblRequisitionType] ([ReqTypeID]),
    CONSTRAINT [FK_tblLabTestPanelAssignment_tblTests] FOREIGN KEY ([TestID]) REFERENCES [dbo].[tblTests] ([TestID])
);

