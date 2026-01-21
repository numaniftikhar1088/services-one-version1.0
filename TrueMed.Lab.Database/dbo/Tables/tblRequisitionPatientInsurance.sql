CREATE TABLE [dbo].[tblRequisitionPatientInsurance] (
    [ReqPatInsID]           INT            IDENTITY (1, 1) NOT NULL,
    [RequisitionID]         INT            NULL,
    [InsuranceID]           INT            NULL,
    [InsuranceName]         NVARCHAR (MAX) NULL,
    [BillingType]           NVARCHAR (MAX) NULL,
    [RelationshipToInsured] NCHAR (10)     NULL,
    [InsuranceProviderID]   INT            NULL,
    [PrimaryGroupID]        NVARCHAR (MAX) NULL,
    [PrimaryPolicyID]       NVARCHAR (MAX) NULL,
    [InsurancePhone]        NVARCHAR (MAX) NULL,
    [AccidentDate]          DATETIME2 (7)  NULL,
    [AccidentType]          NVARCHAR (MAX) NULL,
    [AccidentState]         INT            NULL,
    [SubscriberName]        NVARCHAR (MAX) NULL,
    [SubscriberDOB]         DATETIME2 (7)  NULL,
    [CreatedBy]             NVARCHAR (MAX) NULL,
    [CreatedDate]           DATETIME2 (7)  NULL,
    [UpdatedBy]             NVARCHAR (MAX) NULL,
    [UpdatedDate]           DATETIME2 (7)  NULL,
    [DeletedBy]             NVARCHAR (MAX) NULL,
    [DeletedDate]           DATETIME2 (7)  NULL,
    [IsDeleted]             BIT            CONSTRAINT [DF_tblRequisitionPatientInsurance_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblRequisitionPatientInsurance] PRIMARY KEY CLUSTERED ([ReqPatInsID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID/Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPatientInsurance', @level2type = N'COLUMN', @level2name = N'ReqPatInsID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition ID (tblRequisitionMaster  / tblRequisitionGroupinfo Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPatientInsurance', @level2type = N'COLUMN', @level2name = N'RequisitionID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Insurance ID (tblInsuranceSetup / tblPatientInsurance Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPatientInsurance', @level2type = N'COLUMN', @level2name = N'InsuranceID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Date of Accident', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPatientInsurance', @level2type = N'COLUMN', @level2name = N'AccidentDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Type of Accident (Static Dropdown)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPatientInsurance', @level2type = N'COLUMN', @level2name = N'AccidentType';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'State', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPatientInsurance', @level2type = N'COLUMN', @level2name = N'AccidentState';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'User Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPatientInsurance', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPatientInsurance', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'User Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPatientInsurance', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPatientInsurance', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'User Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPatientInsurance', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Deleted Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPatientInsurance', @level2type = N'COLUMN', @level2name = N'DeletedDate';

