CREATE TABLE [dbo].[tblPatientBasicInfo] (
    [PatientID]                INT            IDENTITY (1, 1) NOT NULL,
    [FirstName]                NVARCHAR (MAX) NOT NULL,
    [MiddleName]               NVARCHAR (MAX) NULL,
    [LastName]                 NVARCHAR (MAX) NOT NULL,
    [DOB]                      DATE           NOT NULL,
    [Gender]                   NVARCHAR (50)  NOT NULL,
    [SocialSecurityNumber]     NVARCHAR (50)  NULL,
    [Ethnicity]                NVARCHAR (50)  NULL,
    [Race]                     NVARCHAR (50)  NULL,
    [PassPortNumber]           NVARCHAR (50)  NULL,
    [CreatedBy]                NVARCHAR (200) NOT NULL,
    [CreatedDate]              DATETIME2 (7)  NOT NULL,
    [UpdatedBy]                NVARCHAR (200) NULL,
    [UpdatedDate]              DATETIME2 (7)  NULL,
    [PatientUserID]            NVARCHAR (50)  NULL,
    [PatientDrivingORIDNumber] NVARCHAR (50)  NULL,
    [PatientType]              NVARCHAR (50)  NULL,
    [IsDeleted]                BIT            CONSTRAINT [DF_tblPatientBasicInfo_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblPatientBasicInfo] PRIMARY KEY CLUSTERED ([PatientID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'PatientID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient First Name', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'FirstName';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Middle Name', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'MiddleName';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Last Name', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'LastName';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Date of Birth', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'DOB';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Gender (Male, Female, Intersex, Prefer not to answer, Unknown)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'Gender';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Social Security Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'SocialSecurityNumber';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Ethnicity (Hispanic or Latino, Not Hispanic or Latino, Not Specified)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'Ethnicity';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Race (Asian, White, Black, American Indian / AK, Hawaiian/Pacific, Not Specified, Unknown, Other)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'Race';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Valid Passport Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'PassPortNumber';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login User ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login User ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Login UserID (Patient Portal)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPatientBasicInfo', @level2type = N'COLUMN', @level2name = N'PatientUserID';

