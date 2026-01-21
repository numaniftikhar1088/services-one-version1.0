CREATE TABLE [dbo].[tblDrugAllergiesAssignment] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [DAID]        NVARCHAR (50)  NOT NULL,
    [DrugName]    NVARCHAR (MAX) NULL,
    [RefLabID]    INT            NOT NULL,
    [LabType]     NVARCHAR (50)  NULL,
    [ReqTypeID]   INT            NULL,
    [FacilityID]  INT            NOT NULL,
    [PanelID]     INT            NULL,
    [IsStatus]    BIT            CONSTRAINT [DF_tblDrugAllergiesAssignment_IsStatus] DEFAULT ((1)) NOT NULL,
    [CreatedBy]   NVARCHAR (MAX) NOT NULL,
    [CreatedDate] DATETIME2 (7)  NOT NULL,
    [UpdatedBy]   NVARCHAR (MAX) NULL,
    [UpdatedDate] DATETIME2 (7)  NULL,
    [DeletedBy]   NVARCHAR (MAX) NULL,
    [DeletedDate] DATETIME2 (7)  NULL,
    [IsDeleted]   BIT            CONSTRAINT [DF_tblDrugAllergiesAssignment_IsDeleted] DEFAULT ((0)) NULL,
    CONSTRAINT [PK_tblDrugAllergiesAssignment] PRIMARY KEY CLUSTERED ([ID] ASC)
);

