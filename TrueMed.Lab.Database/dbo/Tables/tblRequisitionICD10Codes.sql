CREATE TABLE [dbo].[tblRequisitionICD10Codes] (
    [RequisitionICD10ID] INT            IDENTITY (1, 1) NOT NULL,
    [RequisitionOrderID] INT            NOT NULL,
    [RequisitionID]      INT            NULL,
    [ReqTypeID]          INT            NULL,
    [ICD10Code]          NVARCHAR (50)  NULL,
    [ICD10Description]   NVARCHAR (MAX) NULL,
    [ICD10Type]          NVARCHAR (50)  NULL,
    CONSTRAINT [PK_tblRequisitionICD10Codes] PRIMARY KEY CLUSTERED ([RequisitionICD10ID] ASC),
    CONSTRAINT [FK_tblRequisitionICD10Codes_tblRequisitionGroupInfo] FOREIGN KEY ([RequisitionOrderID]) REFERENCES [dbo].[tblRequisitionOrders] ([RequisitionOrderID])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID/Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionICD10Codes', @level2type = N'COLUMN', @level2name = N'RequisitionICD10ID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Group ID (tblRequisitionGroupInfo Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionICD10Codes', @level2type = N'COLUMN', @level2name = N'RequisitionOrderID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition ID (tblRequisitionMaster  / tblRequisitionGroupinfo Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionICD10Codes', @level2type = N'COLUMN', @level2name = N'RequisitionID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Type ID (tblRequisitionType / tblRequisitionGroupinfo Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionICD10Codes', @level2type = N'COLUMN', @level2name = N'ReqTypeID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'ICD10 Code', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionICD10Codes', @level2type = N'COLUMN', @level2name = N'ICD10Code';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Description of ICD10 Code', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionICD10Codes', @level2type = N'COLUMN', @level2name = N'ICD10Description';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'ICD10 Code Type', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionICD10Codes', @level2type = N'COLUMN', @level2name = N'ICD10Type';

