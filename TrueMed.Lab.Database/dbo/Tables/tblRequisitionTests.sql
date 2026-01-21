CREATE TABLE [dbo].[tblRequisitionTests] (
    [RequisitionTestlID] INT            IDENTITY (1, 1) NOT NULL,
    [RequisitionOrderID] INT            NOT NULL,
    [RequisitionID]      INT            NOT NULL,
    [ReqTypeID]          INT            NULL,
    [PanelID]            INT            NULL,
    [TestID]             INT            NULL,
    [TestName]           NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblRequisitiontests] PRIMARY KEY CLUSTERED ([RequisitionTestlID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID/Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionTests', @level2type = N'COLUMN', @level2name = N'RequisitionTestlID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Group ID (tblRequisitionGroupInfo Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionTests', @level2type = N'COLUMN', @level2name = N'RequisitionOrderID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition ID (tblRequisitionMaster / tblRequisitionGroupInfo Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionTests', @level2type = N'COLUMN', @level2name = N'RequisitionID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Type ID (tblRequisitionType / tblRequisitionGroupInfo Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionTests', @level2type = N'COLUMN', @level2name = N'ReqTypeID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Panel ID (tblPanelSetup / tblGPT_Assignment Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionTests', @level2type = N'COLUMN', @level2name = N'PanelID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Test ID (tblTestSetup / tblGPT_Assignment Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionTests', @level2type = N'COLUMN', @level2name = N'TestID';

