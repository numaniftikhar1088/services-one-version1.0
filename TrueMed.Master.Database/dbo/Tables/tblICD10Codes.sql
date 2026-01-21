CREATE TABLE [dbo].[tblICD10Codes] (
    [ICD10ID]     INT            IDENTITY (1, 1) NOT NULL,
    [ICD10Code]   NVARCHAR (50)  NOT NULL,
    [Description] NVARCHAR (MAX) NULL,
    [ICD10Status] BIT            CONSTRAINT [DF_tblICD10Codes_ICD10Status] DEFAULT ((1)) NOT NULL,
    [CreatedBy]   NVARCHAR (MAX) NOT NULL,
    [CreatedDate] DATETIME2 (7)  NOT NULL,
    [UpdatedBy]   NVARCHAR (MAX) NULL,
    [UpdatedDate] DATETIME2 (7)  NULL,
    [DeletedBy]   NVARCHAR (MAX) NULL,
    [DeletedDate] DATETIME2 (7)  NULL,
    [IsDeleted]   BIT            CONSTRAINT [DF_tblICD10Codes_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblICD10Codes] PRIMARY KEY CLUSTERED ([ICD10ID] ASC)
);

