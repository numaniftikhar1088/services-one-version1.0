CREATE TABLE [dbo].[tblICD10Assignment] (
    [ICD10Assignment]  INT            IDENTITY (1, 1) NOT NULL,
    [ICD10ID]          INT            NULL,
    [RefLabID]         INT            NOT NULL,
    [LabType]          NVARCHAR (50)  NULL,
    [ReqTypeID]        INT            NULL,
    [FacilityID]       INT            NOT NULL,
    [PanelID]          INT            NULL,
    [Status]           BIT            CONSTRAINT [DF_tblICD10Assignment_Status] DEFAULT ((1)) NOT NULL,
    [CreatedBy]        NVARCHAR (MAX) NOT NULL,
    [CreatedDate]      DATETIME2 (7)  NOT NULL,
    [UpdatedBy]        NVARCHAR (MAX) NULL,
    [UpdatedDate]      DATETIME2 (7)  NULL,
    [DeletedBy]        NVARCHAR (MAX) NULL,
    [DeletedDate]      DATETIME2 (7)  NULL,
    [IsDeleted]        BIT            CONSTRAINT [DF_tblICD10Assignment_IsDeleted] DEFAULT ((0)) NULL,
    [ICD10Code]        NVARCHAR (MAX) NULL,
    [ICD10Description] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblICD10Assignment] PRIMARY KEY CLUSTERED ([ICD10Assignment] ASC)
);

