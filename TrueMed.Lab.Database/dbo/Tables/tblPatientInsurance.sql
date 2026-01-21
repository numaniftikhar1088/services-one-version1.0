CREATE TABLE [dbo].[tblPatientInsurance] (
    [PatientInsuranceID]  INT            IDENTITY (1, 1) NOT NULL,
    [PatientID]           INT            NULL,
    [InsuranceID]         INT            NULL,
    [InsuranceProviderID] INT            NULL,
    [GroupNumber]         NVARCHAR (50)  NULL,
    [PolicyID]            NVARCHAR (50)  NULL,
    [SFName]              NVARCHAR (MAX) NULL,
    [SLName]              NVARCHAR (MAX) NULL,
    [SDOB]                DATE           NULL,
    [SRelation]           NCHAR (10)     NULL,
    [CreatedBy]           NVARCHAR (200) NOT NULL,
    [CreatedDate]         DATETIME2 (7)  NOT NULL,
    [UpdatedBy]           NVARCHAR (200) NULL,
    [UpdatedDate]         DATETIME2 (7)  NULL,
    [InsurancePhoneNumbr] NVARCHAR (50)  NULL,
    CONSTRAINT [PK_tblPatientInsurance] PRIMARY KEY CLUSTERED ([PatientInsuranceID] ASC),
    CONSTRAINT [FK_tblPatientInsurance_tblPatientBasicInfo] FOREIGN KEY ([PatientID]) REFERENCES [dbo].[tblPatientBasicInfo] ([PatientID])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'PatientInsuranceID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient ID (tblPatientBasicInfo)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'PatientID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Insurance ID (tblInsuranceSetup)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'InsuranceID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Insurance Provider ID (tblInsuranceProvider)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'InsuranceProviderID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Group Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'GroupNumber';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Policy ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'PolicyID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Subscriber First Name', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'SFName';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Subscriber Last Name', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'SLName';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Subscriber Date of Birth', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'SDOB';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Subscriber Relation (Relation with Subscriber) Like Spouse, Father, Son etc.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'SRelation';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'User Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'User Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientInsurance', @level2type = N'COLUMN', @level2name = N'UpdatedDate';

