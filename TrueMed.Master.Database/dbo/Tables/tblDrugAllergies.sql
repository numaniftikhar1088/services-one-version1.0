CREATE TABLE [dbo].[tblDrugAllergies] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [DACode]      NVARCHAR (50)  NULL,
    [Description] NVARCHAR (MAX) NOT NULL,
    [IsActive]    BIT            CONSTRAINT [DF_tblDrugAllergies_IsStatus] DEFAULT ((1)) NOT NULL,
    [CreatedBy]   NVARCHAR (MAX) NOT NULL,
    [CreatedDate] DATETIME2 (7)  NOT NULL,
    [UpdatedBy]   NVARCHAR (MAX) NULL,
    [UpdatedDate] DATETIME2 (7)  NULL,
    [DeletedBy]   NVARCHAR (MAX) NULL,
    [DeletedDate] DATETIME2 (7)  NULL,
    [IsDeleted]   BIT            CONSTRAINT [DF_tblDrugAllergies_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblDrugAllergies] PRIMARY KEY CLUSTERED ([ID] ASC)
);

