CREATE TABLE [dbo].[tblPanelTestSpecimenTypeAssignment] (
    [ID]             INT            IDENTITY (1, 1) NOT NULL,
    [ReqTypeID]      INT            NOT NULL,
    [PanelID]        INT            NULL,
    [TestID]         INT            NULL,
    [SpecimenTypeID] INT            NOT NULL,
    [CreatedBy]      NVARCHAR (MAX) NOT NULL,
    [CreatedDate]    DATETIME2 (7)  NOT NULL,
    [UpdatedBy]      NVARCHAR (MAX) NULL,
    [UpdatedDate]    DATETIME2 (7)  NULL,
    [DeletedBy]      NVARCHAR (MAX) NULL,
    [DeletedDate]    DATETIME2 (7)  NULL,
    [Isactive]       BIT            CONSTRAINT [DF_tblPanelTestSpecimenTypeAssignment_Isactive] DEFAULT ((1)) NOT NULL,
    [IsDeleted]      BIT            CONSTRAINT [DF_tblPanelTestSpecimenTypeAssignment_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblPanelTestSpecimenTypeAssignment] PRIMARY KEY CLUSTERED ([ID] ASC)
);

