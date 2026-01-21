CREATE TABLE [dbo].[tblPrinterSetup] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [PrinterName] NVARCHAR (MAX) NULL,
    [BrandName]   NVARCHAR (MAX) NULL,
    [ModelNumber] NVARCHAR (MAX) NULL,
    [LabelSize]   NVARCHAR (MAX) NULL,
    [LabelType]   NVARCHAR (MAX) NULL,
    [LabID]       INT            NULL,
    [IsDeleted]   BIT            CONSTRAINT [DF_tblPrinterSetup_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblPrinterSetup] PRIMARY KEY CLUSTERED ([ID] ASC)
);

