CREATE TABLE [dbo].[tblRequisitionMedications] (
    [RequisitionMedID]   INT            IDENTITY (1, 1) NOT NULL,
    [RequisitionGroupID] INT            NOT NULL,
    [RequisitionID]      INT            NULL,
    [ReqTypeID]          INT            NULL,
    [MedicaltionClass]   NVARCHAR (50)  NULL,
    [MedicationType]     NVARCHAR (50)  NULL,
    [MedicationName]     NVARCHAR (MAX) NULL,
    [Dosage]             NVARCHAR (50)  NULL,
    [Consideration]      NVARCHAR (50)  NULL,
    [Route]              NVARCHAR (50)  NULL,
    [DrugBankID]         NVARCHAR (50)  NULL,
    CONSTRAINT [PK_tblRequisitionMedications] PRIMARY KEY CLUSTERED ([RequisitionMedID] ASC),
    CONSTRAINT [FK_tblRequisitionMedications_tblRequisitionGroupInfo] FOREIGN KEY ([RequisitionGroupID]) REFERENCES [dbo].[tblRequisitionOrders] ([RequisitionOrderID])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID/Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMedications', @level2type = N'COLUMN', @level2name = N'RequisitionMedID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Group ID (tblRequisitionGroupInfo Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMedications', @level2type = N'COLUMN', @level2name = N'RequisitionGroupID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition ID (tblRequisitionMaster / tblRequisitionGroupInfo Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMedications', @level2type = N'COLUMN', @level2name = N'RequisitionID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Type ID (tblRequisitionType / tblRequisitionGroupInfo Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMedications', @level2type = N'COLUMN', @level2name = N'ReqTypeID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Medication Class', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMedications', @level2type = N'COLUMN', @level2name = N'MedicaltionClass';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Medication Type', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMedications', @level2type = N'COLUMN', @level2name = N'MedicationType';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Medication Name', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMedications', @level2type = N'COLUMN', @level2name = N'MedicationName';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Dosage', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMedications', @level2type = N'COLUMN', @level2name = N'Dosage';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Consideration', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMedications', @level2type = N'COLUMN', @level2name = N'Consideration';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Route', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMedications', @level2type = N'COLUMN', @level2name = N'Route';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Drug Bank ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMedications', @level2type = N'COLUMN', @level2name = N'DrugBankID';

