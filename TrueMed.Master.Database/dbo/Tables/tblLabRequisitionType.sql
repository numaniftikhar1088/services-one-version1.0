CREATE TABLE [dbo].[tblLabRequisitionType] (
    [ID]        INT IDENTITY (1, 1) NOT NULL,
    [LabID]     INT NOT NULL,
    [ReqTypeID] INT NOT NULL,
    [IsDeleted] BIT CONSTRAINT [DF_tblLabRequisitionType_IsDeleted] DEFAULT ((0)) NOT NULL,
    [IsActive]  BIT CONSTRAINT [DF_tblLabRequisitionType_IsActive] DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_tbllabRequisitionType] PRIMARY KEY CLUSTERED ([ID] ASC)
);

