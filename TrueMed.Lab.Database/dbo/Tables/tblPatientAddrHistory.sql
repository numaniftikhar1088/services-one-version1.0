CREATE TABLE [dbo].[tblPatientAddrHistory] (
    [PatientAddrHistoryID] INT            IDENTITY (1, 1) NOT NULL,
    [SequenceNo]           INT            NOT NULL,
    [PatientID]            INT            NOT NULL,
    [Address1]             NVARCHAR (MAX) NULL,
    [Address2]             NVARCHAR (MAX) NULL,
    [ZipCode]              NVARCHAR (50)  NULL,
    [City]                 NVARCHAR (MAX) NULL,
    [State]                NVARCHAR (50)  NULL,
    [Country]              NVARCHAR (50)  NULL,
    [County]               NVARCHAR (50)  NULL,
    [Phone]                NVARCHAR (50)  NULL,
    [Mobile]               NVARCHAR (50)  NULL,
    [Email]                NVARCHAR (MAX) NULL,
    [Weight]               NCHAR (10)     NULL,
    [Height]               NCHAR (10)     NULL,
    [FacilityID]           INT            NOT NULL,
    CONSTRAINT [PK_tblPatientAddrHistory] PRIMARY KEY CLUSTERED ([PatientAddrHistoryID] ASC),
    CONSTRAINT [FK_tblPatientAddrHistory_tblFacility] FOREIGN KEY ([FacilityID]) REFERENCES [dbo].[tblFacility] ([FacilityId]),
    CONSTRAINT [FK_tblPatientAddrHistory_tblPatientBasicInfo] FOREIGN KEY ([PatientID]) REFERENCES [dbo].[tblPatientBasicInfo] ([PatientID])
);


GO
ALTER TABLE [dbo].[tblPatientAddrHistory] NOCHECK CONSTRAINT [FK_tblPatientAddrHistory_tblPatientBasicInfo];


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'PatientAddrHistoryID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated Next Sequence Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'SequenceNo';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient ID (PatientBasicInfo Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'PatientID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Address', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'Address1';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Address', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'Address2';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Zip Code', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'ZipCode';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'City', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'City';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'State / Province', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'State';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Country', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'Country';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'County', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'County';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Land Phone Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'Phone';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Mobile Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'Mobile';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Email (Where he want to receive email for login / resulting/ queries)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'Email';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Weight', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'Weight';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Height', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'Height';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Facility ID (Where he visited)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientAddrHistory', @level2type = N'COLUMN', @level2name = N'FacilityID';

